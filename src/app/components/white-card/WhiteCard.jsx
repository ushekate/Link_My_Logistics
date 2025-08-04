'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package, Warehouse, Truck, Ship, ShieldCheck,
  Search, MapPin, IndianRupee, Calendar, Clock,
  Lightbulb, Rocket, Handshake, Navigation
} from 'lucide-react';

export default function WhiteCard() {
  const router = useRouter();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [numberOfVehicles, setNumberOfVehicles] = useState(1);
  const [freeDaysRange, setFreeDaysRange] = useState(5);
  const [activeService, setActiveService] = useState('cfs');

  const services = [
    { id: 'cfs', label: "CFS", icon: <Package size={24} /> },
    { id: 'transport', label: "Transport", icon: <Truck size={24} /> },
    { id: '3pl', label: "3PL", icon: <Handshake size={24} /> },
    { id: 'warehouse', label: "Warehouse", icon: <Warehouse size={24} /> },
    { id: 'customs', label: "Customs Packages", icon: <ShieldCheck size={24} /> },
  ];

  const vehicleTypes = [
    'Truck',
    'Container Truck',
    'Flatbed Truck',
    'Refrigerated Truck',
    'Tanker Truck',
    'Cargo Van',
    'Pickup Truck',
    'Trailer'
  ];

  const handleServiceClick = (serviceId) => {
    setActiveService(serviceId);
    // Reset form fields when switching services
    setFromLocation('');
    setToLocation('');
    setVehicleType('');
    setNumberOfVehicles(1);
    setFreeDaysRange(7);
  };

  const handleSearch = () => {
    if (activeService === 'customs') {
      alert('Customs service coming soon!');
      return;
    }

    // Validation based on service type
    if (activeService === 'transport') {
      if (!fromLocation || !toLocation || !vehicleType) {
        alert('Please fill in all required fields for Transport service');
        return;
      }
    } else if (activeService === '3pl') {
      if (!fromLocation || !toLocation || !vehicleType) {
        alert('Please fill in all required fields for 3PL service');
        return;
      }
    } else {
      if (!fromLocation) {
        alert('Please enter your location');
        return;
      }
    }

    const searchParams = new URLSearchParams({
      location: fromLocation,
      service: activeService
    });

    // Add additional parameters based on service type
    if (activeService === 'transport') {
      searchParams.append('toLocation', toLocation);
      searchParams.append('vehicleType', vehicleType);
      searchParams.append('numberOfVehicles', numberOfVehicles.toString());
    } else if (activeService === '3pl') {
      searchParams.append('toLocation', toLocation);
      searchParams.append('vehicleType', vehicleType);
      searchParams.append('numberOfVehicles', numberOfVehicles.toString());
      searchParams.append('freeDays', freeDaysRange.toString());
    } else {
      searchParams.append('freeDays', freeDaysRange.toString());
    }

    if (activeService === 'transport') {
      router.push(`/transport?${searchParams.toString()}`);
    } else {
      router.push(`/customer/home?${searchParams.toString()}`);
    }
  };

  const getActiveServiceIndex = () => {
    return services.findIndex(service => service.id === activeService);
  };

  const getProgressWidth = () => {
    const activeIndex = getActiveServiceIndex();
    return `${(activeIndex / (services.length - 1)) * 100}%`;
  };

  const renderFormFields = () => {
    if (activeService === 'transport') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-5 w-4xl">
          {/* From Location */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="text-primary" /> From Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter pickup location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-6 py-4 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg placeholder-secondary"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* To Location */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Navigation className="text-light-primary" /> To Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter delivery location"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full px-6 py-4 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg placeholder-secondary"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-3 h-3 bg-light-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Truck className="text-primary" /> Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-6 py-4 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg"
            >
              <option value="">Select vehicle type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Number of Vehicles */}
          <div className="space-y-3 md:col-span-3">
            <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="text-primary" /> Number of Vehicles
            </label>
            <div className="bg-accent p-6 rounded-xl border-2 border-secondary/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-foreground">{numberOfVehicles}</span>
                <span className="text-sm text-secondary">Vehicles</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={numberOfVehicles}
                onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
                className="w-full h-3 bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(numberOfVehicles / 10) * 100}%, #E5E7EB ${(numberOfVehicles / 10) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-secondary mt-2">
                <span>1 Vehicle</span>
                <span>10 Vehicles</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeService === '3pl') {
      return (
        <div className="space-y-6">
          {/* First Row: From and To Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-4xl">
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                <MapPin className="text-primary" size={18} /> From Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base placeholder-secondary"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                <Navigation className="text-light-primary" size={18} /> To Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter delivery location"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base placeholder-secondary"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-2 h-2 bg-light-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row: Vehicle Type and Number of Vehicles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                <Truck className="text-primary" size={18} /> Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-3 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base"
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                <Package className="text-primary" size={18} /> Number of Vehicles
              </label>
              <div className="bg-accent p-4 rounded-xl border-2 border-secondary/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-foreground">{numberOfVehicles}</span>
                  <span className="text-sm text-secondary">Vehicles</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={numberOfVehicles}
                  onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
                  className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(numberOfVehicles / 10) * 100}%, #E5E7EB ${(numberOfVehicles / 10) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-secondary mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row: Storage Days */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                <Clock className="text-primary" size={18} /> Free Storage Days
              </label>
              <div className="bg-accent p-2 rounded-xl border-2 border-secondary/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl font-bold text-foreground">{freeDaysRange}</span>
                  <span className="text-sm text-secondary">Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={freeDaysRange}
                  onChange={(e) => setFreeDaysRange(Number(e.target.value))}
                  className="w-full h-auto bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(freeDaysRange / 15) * 100}%, #E5E7EB ${(freeDaysRange / 15) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-secondary mt-1">
                  <span>1</span>
                  <span>15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Default form for CFS and Warehouse
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5 w-4xl">
          {/* Location Input */}
          <div className="space-y-3 space-x-8">
            <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="text-primary" /> Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-6 py-4 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg placeholder-secondary"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-secondary mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Select your preferred {services.find(s => s.id === activeService)?.label} area
            </p>
          </div>

          {/* Free Storage Days */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="text-primary" /> Free Storage Days
            </label>
            <div className="bg-accent p-6 rounded-xl border-2 border-secondary/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-foreground">{freeDaysRange}</span>
                <span className="text-sm text-secondary">Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={freeDaysRange}
                onChange={(e) => setFreeDaysRange(Number(e.target.value))}
                className="w-full h-3 bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(freeDaysRange / 15) * 100}%, #E5E7EB ${(freeDaysRange / 15) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-secondary mt-2">
                <span>1 Day</span>
                <span>15 Days</span>
              </div>
            </div>
            <p className="text-sm text-secondary mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Up to {freeDaysRange} free storage days
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <section className="hidden sm:flex justify-center items-center h-auto w-full relative">

        <div className="white-card relative min-h-screen w-[100%] shadow-2xl z-10">

          {/* Progress Line Background */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-[58%] h-1 bg-secondary/30 rounded-full z-0" />

          {/* Animated Progress Line */}
          <div
            className="absolute top-24 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-primary to-light-primary rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{
              width: '58%',
              clipPath: `inset(0 ${100 - parseFloat(getProgressWidth())}% 0 0)`
            }}
          />

          {/* Service Icons */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[60%] flex justify-between z-10">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className={`p-3 rounded-full mt-3 transition-all duration-300 ${activeService === service.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-accent text-primary hover:bg-primary hover:text-background'
                  }`}>
                  {service.icon}
                </div>
                <p className={`mt-2 text-sm font-medium text-center bg-background px-1.5 py-0.5 inline-flex items-center justify-center rounded-lg transition-all duration-300 ${activeService === service.id
                  ? 'text-primary font-bold'
                  : 'text-secondary'
                  }`}>
                  {service.label}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-auto max-w-full">
            <div className={`bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-secondary/10 ${activeService === '3pl' ? 'p-8' : 'p-12'
              }`}>
              {/* Header */}
              <div className={`text-center ${activeService === '3pl' ? 'mb-2' : 'mb-4'}`}>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  🔍 What Are You Looking For?
                </h2>
                <p className="text-secondary">
                  Find the perfect {services.find(s => s.id === activeService)?.label} solution for your needs ✨
                </p>
              </div>

              {renderFormFields()}

              {/* Search Button */}
              <div className="text-center">
                <button
                  onClick={handleSearch}
                  disabled={
                    (activeService === 'transport' && (!fromLocation || !toLocation || !vehicleType)) ||
                    (activeService === '3pl' && (!fromLocation || !toLocation || !vehicleType)) ||
                    ((activeService === 'cfs' || activeService === 'warehouse') && !fromLocation)
                  }
                  className="group relative inline-flex items-center justify-center px-8 py-2 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-primary to-light-primary rounded-2xl hover:from-light-primary hover:to-primary focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <Search className="w-6 h-6 mr-3" />
                  Search {services.find(s => s.id === activeService)?.label} Now
                  <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
                <p className="text-sm text-secondary mt-4 flex items-center gap-2 justify-center">
                  <Rocket className="w-4 h-4" /> Find the perfect solution in seconds
                </p>
              </div>

            </div>
          </div>

        </div>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: var(--primary);
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(55, 105, 211, 0.4);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: var(--primary);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }
          
          .slider::-moz-range-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(55, 105, 211, 0.4);
          }
        `}</style>
      </section>
    </div>
  );
}



















// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Package, Warehouse, Truck, Ship, ShieldCheck,
//   Search, MapPin, IndianRupee, Calendar, Clock,
//   Lightbulb, Rocket, Handshake, Navigation
// } from 'lucide-react';

// export default function WhiteCard() {
//   const router = useRouter();
//   const [fromLocation, setFromLocation] = useState('');
//   const [toLocation, setToLocation] = useState('');
//   const [vehicleType, setVehicleType] = useState('');
//   const [numberOfVehicles, setNumberOfVehicles] = useState(1);
//   const [tariffRange, setTariffRange] = useState(1000);
//   const [freeDaysRange, setFreeDaysRange] = useState(5);
//   const [activeService, setActiveService] = useState('cfs');

//   const services = [
//     { id: 'cfs', label: "CFS", icon: <Package size={24} /> },
//     { id: 'transport', label: "Transport", icon: <Truck size={24} /> },
//     { id: '3pl', label: "3PL", icon: <Handshake size={24} /> },
//     { id: 'warehouse', label: "Warehouse", icon: <Warehouse size={24} /> },
//     { id: 'customs', label: "Customs Packages", icon: <ShieldCheck size={24} /> },
//   ];

//   const getProgressFraction = () => {
//   const index = services.findIndex(s => s.id === activeService);
//   const total = services.length - 1;
//   return index / total; // returns 0.0 to 1.0
// };


//   const vehicleTypes = [
//     'Truck',
//     'Container Truck',
//     'Flatbed Truck',
//     'Refrigerated Truck',
//     'Tanker Truck',
//     'Cargo Van',
//     'Pickup Truck',
//     'Trailer'
//   ];

//   const handleServiceClick = (serviceId) => {
//     setActiveService(serviceId);
//     // Reset form fields when switching services
//     setFromLocation('');
//     setToLocation('');
//     setVehicleType('');
//     setNumberOfVehicles(1);
//     setTariffRange(25000);
//     setFreeDaysRange(7);
//   };

//   const handleSearch = () => {
//     if (activeService === 'customs') {
//       alert('Customs service coming soon!');
//       return;
//     }

//     // Validation based on service type
//     if (activeService === 'transport') {
//       if (!fromLocation || !toLocation || !vehicleType) {
//         alert('Please fill in all required fields for Transport service');
//         return;
//       }
//     } else if (activeService === '3pl') {
//       if (!fromLocation || !toLocation || !vehicleType) {
//         alert('Please fill in all required fields for 3PL service');
//         return;
//       }
//     } else {
//       if (!fromLocation) {
//         alert('Please enter your location');
//         return;
//       }
//     }

//     const searchParams = new URLSearchParams({
//       location: fromLocation,
//       service: activeService
//     });

//     // Add additional parameters based on service type
//     if (activeService === 'transport') {
//       searchParams.append('toLocation', toLocation);
//       searchParams.append('vehicleType', vehicleType);
//       searchParams.append('numberOfVehicles', numberOfVehicles.toString());
//     } else if (activeService === '3pl') {
//       searchParams.append('toLocation', toLocation);
//       searchParams.append('vehicleType', vehicleType);
//       searchParams.append('numberOfVehicles', numberOfVehicles.toString());
//       searchParams.append('tariff', tariffRange.toString());
//       searchParams.append('freeDays', freeDaysRange.toString());
//     } else {
//       searchParams.append('tariff', tariffRange.toString());
//       searchParams.append('freeDays', freeDaysRange.toString());
//     }

//     if (activeService === 'transport') {
//       router.push(`/transport?${searchParams.toString()}`);
//     } else {
//       router.push(`/customer/home?${searchParams.toString()}`);
//     }
//   };

//   const getActiveServiceIndex = () => {
//     return services.findIndex(service => service.id === activeService);
//   };

//   const getProgressWidth = () => {
//     const activeIndex = getActiveServiceIndex();
//     return `${(activeIndex / (services.length - 1)) * 100}%`;
//   };

//   const renderFormFields = () => {
//     if (activeService === 'transport') {
//       return (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* From Location */}
//           <div className="space-y-3">
//             <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//               <MapPin className="text-primary" /> From Location
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Enter pickup location"
//                 value={fromLocation}
//                 onChange={(e) => setFromLocation(e.target.value)}
//                 className="w-full px-6 py-4 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg placeholder-secondary"
//               />
//               <div className="absolute inset-y-0 right-0 flex items-center pr-4">
//                 <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//               </div>
//             </div>
//           </div>

//           {/* To Location */}
//           <div className="space-y-2">
//             <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//               <Navigation className="text-light-primary" /> To Location
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Enter delivery location"
//                 value={toLocation}
//                 onChange={(e) => setToLocation(e.target.value)}
//                 className="w-full px-6 py-4 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg placeholder-secondary"
//               />
//               <div className="absolute inset-y-0 right-0 flex items-center pr-4">
//                 <div className="w-3 h-3 bg-light-primary rounded-full animate-pulse"></div>
//               </div>
//             </div>
//           </div>

//           {/* Vehicle Type */}
//           <div className="space-y-3">
//             <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//               <Truck className="text-primary" /> Vehicle Type
//             </label>
//             <select
//               value={vehicleType}
//               onChange={(e) => setVehicleType(e.target.value)}
//               className="w-full px-6 py-4 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg"
//             >
//               <option value="">Select vehicle type</option>
//               {vehicleTypes.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>

//           {/* Number of Vehicles */}
//           <div className="md:col-span-3 mb-3">
//             <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//               <Package className="text-primary" /> Number of Vehicles
//             </label>
//             <div className="bg-accent p-2 px-4 rounded-xl border-2 border-secondary/20">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-2xl font-bold text-foreground">{numberOfVehicles}</span>
//                 <span className="text-sm text-secondary">Vehicles</span>
//               </div>
//               <input
//                 type="range"
//                 min="1"
//                 max="10"
//                 step="1"
//                 value={numberOfVehicles}
//                 onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
//                 className="w-full bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
//                 style={{
//                   background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(numberOfVehicles / 10) * 100}%, #E5E7EB ${(numberOfVehicles / 10) * 100}%, #E5E7EB 100%)`
//                 }}
//               />
//               <div className="flex justify-between text-xs text-secondary mt-2">
//                 <span>1 Vehicle</span>
//                 <span>10 Vehicles</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     } else if (activeService === '3pl') {
//       return (
//         <div className="">
//           {/* First Row: From and To Location */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
//                 <MapPin className="text-primary" size={18} /> From Location
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Enter pickup location"
//                   value={fromLocation}
//                   onChange={(e) => setFromLocation(e.target.value)}
//                   className="w-full px-4 py-3 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base placeholder-secondary"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                   <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
//                 <Navigation className="text-light-primary" size={18} /> To Location
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Enter delivery location"
//                   value={toLocation}
//                   onChange={(e) => setToLocation(e.target.value)}
//                   className="w-full px-4 py-3 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base placeholder-secondary"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                   <div className="w-2 h-2 bg-light-primary rounded-full animate-pulse"></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Second Row: Vehicle Type and Number of Vehicles */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
//                 <Truck className="text-primary" size={18} /> Vehicle Type
//               </label>
//               <select
//                 value={vehicleType}
//                 onChange={(e) => setVehicleType(e.target.value)}
//                 className="w-full px-4 py-3 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base"
//               >
//                 <option value="">Select vehicle type</option>
//                 {vehicleTypes.map((type) => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
//                 <Package className="text-primary" size={18} /> Number of Vehicles
//               </label>
//               <div className="bg-accent p-2 px-4 rounded-xl border-2 border-secondary/20">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-xl font-bold text-foreground">{numberOfVehicles}</span>
//                   <span className="text-sm text-secondary">Vehicles</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="1"
//                   max="10"
//                   step="1"
//                   value={numberOfVehicles}
//                   onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
//                   className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
//                   style={{
//                     background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(numberOfVehicles / 10) * 100}%, #E5E7EB ${(numberOfVehicles / 10) * 100}%, #E5E7EB 100%)`
//                   }}
//                 />
//                 <div className="flex justify-between text-xs text-secondary mt-1">
//                   <span>1</span>
//                   <span>10</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Third Row: Tariff and Storage Days */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
//             <div className="space-y-2">
//               <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
//                 <IndianRupee className="text-primary" size={18} /> Max Tariff Rate
//               </label>
//               <div className="bg-accent p-2 px-4 rounded-xl border-2 border-secondary/20">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-xl font-bold text-foreground">₹{tariffRange.toLocaleString()}</span>
//                   <span className="text-sm text-secondary">Max Budget</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="5000"
//                   max="100000"
//                   step="1000"
//                   value={tariffRange}
//                   onChange={(e) => setTariffRange(Number(e.target.value))}
//                   className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
//                   style={{
//                     background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB 100%)`
//                   }}
//                 />
//                 <div className="flex justify-between text-xs text-secondary mt-1">
//                   <span>₹5K</span>
//                   <span>₹1L</span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
//                 <Clock className="text-primary" size={18} /> Free Storage Days
//               </label>
//               <div className="bg-accent p-2 px-4 rounded-xl border-2 border-secondary/20">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-xl font-bold text-foreground">{freeDaysRange}</span>
//                   <span className="text-sm text-secondary">Days</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="1"
//                   max="15"
//                   step="1"
//                   value={freeDaysRange}
//                   onChange={(e) => setFreeDaysRange(Number(e.target.value))}
//                   className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
//                   style={{
//                     background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(freeDaysRange / 15) * 100}%, #E5E7EB ${(freeDaysRange / 15) * 100}%, #E5E7EB 100%)`
//                   }}
//                 />
//                 <div className="flex justify-between text-xs text-secondary mt-1">
//                   <span>1</span>
//                   <span>15</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     } else {
//       // Default form for CFS and Warehouse
//       return (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
//           {/* Location Input */}
//           <div className="space-y-3">
//             <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//               <MapPin className="text-primary" /> Location
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Enter your location"
//                 value={fromLocation}
//                 onChange={(e) => setFromLocation(e.target.value)}
//                 className="w-full px-6 py-4 bg-accent border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg placeholder-secondary"
//               />
//               <div className="absolute inset-y-0 right-0 flex items-center pr-4">
//                 <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
//               </div>
//             </div>
//             <p className="text-sm text-black mt-2 flex items-center gap-2">
//               <Calendar className="w-4 h-4" /> Select your preferred {services.find(s => s.id === activeService)?.label} area
//             </p>
//           </div>

//           {/* Tariff Rate */}
//           <div className="space-y-3">
//             <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//               <IndianRupee className="text-primary" /> Max Tariff Rate
//             </label>
//             <div className="bg-accent p-6 rounded-xl border-2 border-secondary/20">
//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-2xl font-bold text-foreground">₹{tariffRange.toLocaleString()}</span>
//                 <span className="text-sm text-secondary">Max Budget</span>
//               </div>
//               <input
//                 type="range"
//                 min="1000"
//                 max="10000"
//                 step="1000"
//                 value={tariffRange}
//                 onChange={(e) => setTariffRange(Number(e.target.value))}
//                 className="w-full h-3 bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
//                 style={{
//                   background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((tariffRange - 1000) / (10000 - 1000)) * 100}%, #E5E7EB ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB 100%)`
//                 }}
//               />
//               <div className="flex justify-between text-xs text-secondary mt-2">
//                 <span>₹1,000</span>
//                 <span>₹10,000</span>
//               </div>
//             </div>
//             <p className="text-sm text-black mt-2 flex items-center gap-2">
//               <Lightbulb className="w-4 h-4" /> Set your budget range
//             </p>
//           </div>

//           {/* Free Storage Days */}
//           <div className="space-y-3">
//             <label className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//               <Clock className="text-primary" /> Free Storage Days
//             </label>
//             <div className="bg-accent p-6 rounded-xl border-2 border-secondary/20">
//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-2xl font-bold text-foreground">{freeDaysRange}</span>
//                 <span className="text-sm text-secondary">Days</span>
//               </div>
//               <input
//                 type="range"
//                 min="1"
//                 max="15"
//                 step="1"
//                 value={freeDaysRange}
//                 onChange={(e) => setFreeDaysRange(Number(e.target.value))}
//                 className="w-full h-3 bg-secondary/20 rounded-lg appearance-none cursor-pointer slider"
//                 style={{
//                   background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(freeDaysRange / 15) * 100}%, #E5E7EB ${(freeDaysRange / 15) * 100}%, #E5E7EB 100%)`
//                 }}
//               />
//               <div className="flex justify-between text-xs text-secondary mt-2">
//                 <span>1 Day</span>
//                 <span>15 Days</span>
//               </div>
//             </div>
//             <p className="text-sm text-black mt-2 flex items-center gap-2">
//               <Calendar className="w-4 h-4" /> Up to {freeDaysRange} free storage days
//             </p>
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <div>
//       <section className="hidden sm:flex justify-center items-center mt-6 h-screen w-full relative">

//         {/* <div className="white-card relative min-h-[90dvh] w-[90%] bg-background backdrop-blur-sm border rounded-lg shadow-2xl z-10"> */}
//         <div className="white-card relative min-h-screen w-[100%] shadow-2xl z-10">


//           {/* Progress Line Background */}
//           <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-[50%] h-1 bg-secondary/30 rounded-full z-0" />

//           {/* Animated Progress Line */}
//           <div
//             className="absolute top-19 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-primary to-light-primary rounded-full z-0 transition-all duration-500 ease-in-out"
//             style={{
//               width: '58%',
//               clipPath: `inset(0 ${(1 - getProgressFraction()) * 100}% 0 0)`,
//             }}
//           />

//           {/* Service Icons */}
//           <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-[60%] flex justify-between z-10">
//             {services.map((service, index) => (
//               <div
//                 key={service.id}
//                 className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110"
//                 onClick={() => handleServiceClick(service.id)}
//               >
//                 <div className={`p-3 rounded-full mt-3 transition-all duration-300 ${activeService === service.id
//                   ? 'bg-primary text-white shadow-lg'
//                   : 'bg-accent text-primary hover:bg-primary/40'
//                   }`}>
//                   {service.icon}
//                 </div>
//                 <p className={`mt-2 text-sm font-medium text-center transition-all duration-300 ${activeService === service.id
//                   ? 'text-black font-bold bg-white rounded-full px-2'
//                   : 'text-black bg-white rounded-full px-2'
//                   }`}>
//                   {service.label}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Main Content */}
//           <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[85%] max-w-5xl">
//             <div className={`bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-secondary/10 ${activeService === '3pl' ? 'p-8' : 'p-12'
//               }`}>

//               {/* Header */}
//               <div className={`text-center pt-4 ${activeService === '3pl' ? 'mb-8' : 'mb-10'}`}>
//                 <h2 className="text-3xl font-bold text-foreground mb-2">
//                   🔍 What Are You Looking For?
//                 </h2>
//                 <p className="text-black">
//                   Find the perfect {services.find(s => s.id === activeService)?.label} solution for your needs ✨
//                 </p>
//               </div>

//               {renderFormFields()}

//               {/* Search Button */}
//               <div className="text-center">
//                 <button
//                   onClick={handleSearch}
//                   disabled={
//                     (activeService === 'transport' && (!fromLocation || !toLocation || !vehicleType)) ||
//                     (activeService === '3pl' && (!fromLocation || !toLocation || !vehicleType)) ||
//                     ((activeService === 'cfs' || activeService === 'warehouse') && !fromLocation)
//                   }
//                   className="group relative inline-flex items-center justify-center px-8 py-3 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-primary to-light-primary rounded-2xl hover:from-light-primary hover:to-primary focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105"
//                 >
//                   <Search className="w-6 h-6 mr-3" />
//                   Search {services.find(s => s.id === activeService)?.label} Now
//                   <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//                 </button>
//                 <p className="text-sm text-black mt-4 -mb-6 flex items-center gap-2 justify-center">
//                   <Rocket className="w-4 h-4" /> Find the perfect solution in seconds
//                 </p>
//               </div>

//             </div>
//           </div>

//         </div>

//         <style jsx>{`
//           .slider::-webkit-slider-thumb {
//             appearance: none;
//             height: 20px;
//             width: 20px;
//             border-radius: 50%;
//             background: var(--primary);
//             cursor: pointer;
//             box-shadow: 0 2px 6px rgba(0,0,0,0.2);
//             transition: all 0.3s ease;
//           }
          
//           .slider::-webkit-slider-thumb:hover {
//             transform: scale(1.2);
//             box-shadow: 0 4px 12px rgba(55, 105, 211, 0.4);
//           }
          
//           .slider::-moz-range-thumb {
//             height: 20px;
//             width: 20px;
//             border-radius: 50%;
//             background: var(--primary);
//             cursor: pointer;
//             border: none;
//             box-shadow: 0 2px 6px rgba(0,0,0,0.2);
//             transition: all 0.3s ease;
//           }
          
//           .slider::-moz-range-thumb:hover {
//             transform: scale(1.2);
//             box-shadow: 0 4px 12px rgba(55, 105, 211, 0.4);
//           }
//         `}</style>
//       </section>
//     </div>
//   );
// }

