import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { Check } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import pbclient from "@/lib/db";

export default function UserInput({ setUserId }) {
  const { data: users } = useCollection('users');

  const [formData, setFormData] = useState({
    userId: '',
    userInfo: '',
  });
  const [showUsers, setShowUsers] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      userInfo: value,
      userId: '',
    }));
    setShowUsers(value.trim() !== '');
  };

  const handleSelect = ({ info }) => {
    setFormData({
      userInfo: `${info?.firstname} ${info?.lastname} - ${info?.username}`,
      userId: info?.id,
    });
    setUserId(info.id);
    setShowUsers(false);
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <Label title="End User" />
      <Input
        type="text"
        name="userInfo"
        value={formData.userInfo}
        onChange={handleChange}
        placeholder="eg; John Doe, etc."
        autoComplete="off"
      />

      {showUsers && (
        <div className="absolute top-[7dvh] z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {users
            .filter(user =>
              (`${user?.firstname} ${user?.lastname} - ${user?.username}`)
                .toLowerCase()
                .includes(formData.userInfo.toLowerCase())
            )
            .map((user) => {
              const imgUrl = pbclient?.files?.getURL(user, user?.avatar) || '';
              console.log('Image', imgUrl);

              return (
                <div
                  key={user?.id}
                  className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer border"
                  onClick={() => handleSelect({ info: user })}
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={imgUrl} alt="Logo" />
                      <AvatarFallback>
                        {user?.firstname?.charAt(0)?.toUpperCase()}
                        {user?.lastname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user?.firstname} {user?.lastname}</p>
                      <p>{user?.username}</p>
                    </div>
                  </div>
                  {formData.userId === user.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              )
            }
            )
          }
        </div>
      )}
    </div>
  )
}
