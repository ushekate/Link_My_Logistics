'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package, Warehouse, Truck, Ship, ShieldCheck,
  Search, MapPin, IndianRupee, Calendar, Clock,
  Lightbulb, Rocket, Handshake, Navigation
} from 'lucide-react';

const MobileWhiteCard = () => {
  const router = useRouter();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [numberOfVehicles, setNumberOfVehicles] = useState(1);
  const [tariffRange, setTariffRange] = useState(25000);
  const [freeDaysRange, setFreeDaysRange] = useState(7);
  const [activeService, setActiveService] = useState('cfs');

  const services = [
    { id: 'cfs', label: "CFS", icon: <Package size={20} /> },
    { id: 'transport', label: "Transport", icon: <Truck size={20} /> },
    { id: '3pl', label: "3PL", icon: <Handshake size={20} /> },
    { id: 'warehouse', label: "Warehouse", icon: <Warehouse size={20} /> },
    { id: 'customs', label: "Customs", icon: <ShieldCheck size={20} /> },
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
    setTariffRange(25000);
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
      searchParams.append('tariff', tariffRange.toString());
      searchParams.append('freeDays', freeDaysRange.toString());
    } else {
      searchParams.append('tariff', tariffRange.toString());
      searchParams.append('freeDays', freeDaysRange.toString());
    }

    // All services route to customer/home as they are tabs/buttons within the same page
    router.push(`/customer/home?${searchParams.toString()}`);
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
        <div className="space-y-4">
          {/* From Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="text-primary" size={16} /> From Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter pickup location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* To Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Navigation className="text-green-500" size={16} /> To Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter delivery location"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Truck className="text-purple-500" size={16} /> Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm"
            >
              <option value="">Select vehicle type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Number of Vehicles */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Package className="text-orange-500" size={16} /> Number of Vehicles
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-800">{numberOfVehicles}</span>
                <span className="text-xs text-gray-600">Vehicles</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={numberOfVehicles}
                onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(numberOfVehicles / 10) * 100}%, #E5E7EB ${(numberOfVehicles / 10) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeService === '3pl') {
      return (
        <div className="space-y-4">
          {/* From Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="text-blue-500" size={16} /> From Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter pickup location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* To Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Navigation className="text-green-500" size={16} /> To Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter delivery location"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Truck className="text-purple-500" size={16} /> Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm"
            >
              <option value="">Select vehicle type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Number of Vehicles */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Package className="text-orange-500" size={16} /> Number of Vehicles
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-800">{numberOfVehicles}</span>
                <span className="text-xs text-gray-600">Vehicles</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={numberOfVehicles}
                onChange={(e) => setNumberOfVehicles(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(numberOfVehicles / 10) * 100}%, #E5E7EB ${(numberOfVehicles / 10) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Tariff Rate */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <IndianRupee className="text-green-500" size={16} /> Max Tariff Rate
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-800">₹{tariffRange.toLocaleString()}</span>
                <span className="text-xs text-gray-600">Max Budget</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="1000"
                value={tariffRange}
                onChange={(e) => setTariffRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>₹5K</span>
                <span>₹1L</span>
              </div>
            </div>
          </div>

          {/* Free Storage Days */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="text-purple-500" size={16} /> Free Storage Days
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-800">{freeDaysRange}</span>
                <span className="text-xs text-gray-600">Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={freeDaysRange}
                onChange={(e) => setFreeDaysRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(freeDaysRange / 15) * 100}%, #E5E7EB ${(freeDaysRange / 15) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1</span>
                <span>15</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Default form for CFS and Warehouse
      return (
        <div className="space-y-4">
          {/* Location Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="text-blue-500" size={16} /> Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Select your preferred {services.find(s => s.id === activeService)?.label} area
            </p>
          </div>

          {/* Tariff Rate */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <IndianRupee className="text-green-500" size={16} /> Max Tariff Rate
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-800">₹{tariffRange.toLocaleString()}</span>
                <span className="text-xs text-gray-600">Max Budget</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="1000"
                value={tariffRange}
                onChange={(e) => setTariffRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB ${((tariffRange - 5000) / (100000 - 5000)) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>₹5K</span>
                <span>₹1L</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <Lightbulb className="w-3 h-3" /> Set your budget range
            </p>
          </div>

          {/* Free Storage Days */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="text-purple-500" size={16} /> Free Storage Days
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-800">{freeDaysRange}</span>
                <span className="text-xs text-gray-600">Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={freeDaysRange}
                onChange={(e) => setFreeDaysRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(freeDaysRange / 15) * 100}%, #E5E7EB ${(freeDaysRange / 15) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1</span>
                <span>15</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Up to {freeDaysRange} free storage days
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="sm:hidden min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      {/* Header with proper spacing from navbar */}
      <div className="text-center mb-6 pt-20"> {/* Increased padding-top from pt-4 to pt-20 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🔍 What Are You Looking For?
        </h1>
        <p className="text-gray-600 text-sm">
          Find the perfect solution for your needs ✨
        </p>
      </div>

      {/* Service Tabs */}
      <div className="mb-6">
        {/* Progress Line Background */}
        <div className="relative mb-4">
          <div className="w-full h-1 bg-gray-300 rounded-full" />
          <div
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: getProgressWidth() }}
          />
        </div>

        {/* Service Icons */}
        <div className="flex justify-between items-center">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-center cursor-pointer transition-all duration-300"
              onClick={() => handleServiceClick(service.id)}
            >
              <div className={`p-2 rounded-full transition-all duration-300 ${activeService === service.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 text-blue-500'
                }`}>
                {service.icon}
              </div>
              <p className={`mt-1 text-xs font-medium text-center transition-all duration-300 ${activeService === service.id
                ? 'text-blue-600 font-bold'
                : 'text-gray-600'
                }`}>
                {service.label}
                {service.id === 'customs' && <span className="block text-xs text-orange-500">Soon</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            {services.find(s => s.id === activeService)?.label} Service
          </h2>
          <p className="text-xs text-gray-600">
            Fill in the details below to find the best options
          </p>
        </div>

        {renderFormFields()}
      </div>

      {/* Search Button */}
      <div className="mb-6">
        <button
          onClick={handleSearch}
          disabled={
            (activeService === 'transport' && (!fromLocation || !toLocation || !vehicleType)) ||
            (activeService === '3pl' && (!fromLocation || !toLocation || !vehicleType)) ||
            ((activeService === 'cfs' || activeService === 'warehouse') && !fromLocation)
          }
          className="w-full inline-flex items-center justify-center px-6 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Search className="w-5 h-5 mr-2" />
          Search {services.find(s => s.id === activeService)?.label}
        </button>
        <p className="text-xs text-gray-600 mt-2 text-center flex items-center gap-1 justify-center">
          <Rocket className="w-3 h-3" /> Find the perfect solution in seconds
        </p>
      </div>

      {/* Truck Image */}
      <div className="flex justify-center">
        <img
          src="/Truck.png"
          alt="Delivery Van"
          className="w-48 h-32 object-contain opacity-80"
        />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 8px rgba(59, 130, 246, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 8px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}

export default MobileWhiteCard;

