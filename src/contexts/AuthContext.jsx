'use client';

import pbclient from "@/lib/db";
import { createContext, useContext, useState } from "react";
import { logUserLogin, logUserLogout, logFailedLogin } from "@/utils/auditLogger";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";

const authContext = createContext({});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(pbclient.authStore.record);
  const [loading, setLoading] = useState(null);
  const { data: userData, updateItem: UpdateUser } = useCollection('users');

  async function Login(emailOrUsername, password, role) {
    try {
      if (emailOrUsername !== '' || emailOrUsername !== null) {
        const identity = emailOrUsername;
        const res = await pbclient.collection('users').authWithPassword(identity, password);
        if (role === res.record.role) {
          setUser(res.record);

          // Log successful login
          await logUserLogin(res.record.email || res.record.username, res.record);

          return res;
        } else {
          // Log failed login due to role mismatch
          await logFailedLogin(`${emailOrUsername} (role mismatch: expected ${role}, got ${res.record.role})`);
          alert("Role don't match");
        }
      } else {
        console.error("Email or Username must not be empty!!!");
      }
    } catch (err) {
      // Log failed login attempt
      await logFailedLogin(emailOrUsername);
      console.error(err);
    }
  }

  async function LoginWithGoogle(role) {
    try {
      const res = await pbclient.collection('users').authWithOAuth2({ provider: 'google' });
      if (res.record.id) {
        const addUserDetails = await UpdateUser(res.record.id, {
          firstname: res.meta.rawUser.given_name,
          lastname: res.meta.rawUser.family_name,
          emailVisibility: true,
          role: role,
          status: 'Pending'
        });

        return {
          isAuthenticated: true,
          result: res,
          userdetails: addUserDetails,
          message: 'User Authenticated'
        };
      }
      return {
        isAuthenticated: false,
        result: res,
        message: 'User is Not Authenticated'
      }
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async function Register(email, username, password, passwordConfirm, role) {
    try {
      const data = {
        "email": email,
        "emailVisibility": true,
        "username": username,
        "password": password,
        "passwordConfirm": passwordConfirm,
        "role": role
      };
      const res = await pbclient.collection('users').create(data);
      return res;
    } catch (err) {
      throw new Error(err)
    }
  }

  async function Logout() {
    try {
      const currentUser = user;
      // Log logout before clearing auth
      if (currentUser) {
        const isUserLogout = await logUserLogout(currentUser.email || currentUser.username, currentUser);
        toast.success(isUserLogout.details);
      }
      pbclient.authStore.clear();
      localStorage.removeItem('pocketbase_auth');
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  }

  const value = {
    user,
    loading,
    Login,
    LoginWithGoogle,
    Logout,
    Register
  };

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthLayoutProvider')
  }
  return context;
} 
