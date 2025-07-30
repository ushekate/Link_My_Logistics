"use client";

import { parseTagsFromResponse } from "@/app/(software)/client/(after_login)/profile/utils/tagUtils";
import Footer from "@/app/components/footer/Footer";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import RenderRatings from "@/components/ui/renderRatings";
import { Select, SelectItem } from "@/components/ui/Select";
import { PB_URL } from "@/constants/url";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCollection } from "@/hooks/useCollection";
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Search,
    SlidersHorizontalIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ContactGolPopup from "./components/ContactGolPopup";
import { FilterCFS } from "./components/Filter";
import HeaderLayout from "./components/HeaderLayout";
import LoginPopUp from "./components/LoginPopUp";
import MobileHeaderLayout from "./components/MobileHeaderLayout";
import { RequestPopup } from "./components/RequestPopup";

export default function ClientHomePage() {
  const { user } = useAuth();
  const { data: providers } = useCollection("service_provider", {
    expand: "service",
  });
  const { data: packages } = useCollection("custom_packages", {
    expand: "services",
  });

  const [currentService, setCurrentService] = useState("CFS");
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [filter, setFilter] = useState("");
  const [SearchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [showContactGolPopup, setShowContactGolPopup] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  useEffect(() => {
    // Filter services
    if (providers?.length > 0) {
      let filtered = providers.filter((provider) =>
        provider?.expand?.service?.some(
          (service) => service?.title === currentService
        )
      );

      if (SearchQuery.trim()) {
        filtered = filtered.filter((provider) => {
          if (filter === "title") {
            return provider?.title
              ?.toLowerCase()
              .includes(SearchQuery.toLowerCase());
          } else if (filter === "location") {
            return provider?.location
              ?.toLowerCase()
              .includes(SearchQuery.toLowerCase());
          } else {
            // default fallback
            return (
              provider?.title?.toLowerCase().includes(SearchQuery.toLowerCase()) ||
              provider?.location?.toLowerCase().includes(SearchQuery.toLowerCase())
            );
          }
        });
      }

      // Apply advanced filters if they exist
      if (appliedFilters && currentService === "CFS") {
        filtered = filtered.filter((provider) => {
          // Filter by free days if specified
          if (appliedFilters.freeDays && appliedFilters.freeDays !== '7 Days') {
            const freeDaysValue = parseInt(appliedFilters.freeDays);
            // Assuming provider has freeDays property or we need to check tariffs
            if (provider.freeDays && provider.freeDays < freeDaysValue) {
              return false;
            }
          }

          // Filter by free days range if specified
          if (appliedFilters.freeDaysRange) {
            const { min, max } = appliedFilters.freeDaysRange;
            if (provider.freeDays) {
              if (provider.freeDays < min || provider.freeDays > max) {
                return false;
              }
            }
          }

          // Filter by tariff price range if specified
          if (appliedFilters.tariffPriceRange) {
            const { min, max } = appliedFilters.tariffPriceRange;
            if (provider.tariffRate) {
              if (provider.tariffRate < min || provider.tariffRate > max) {
                return false;
              }
            }
          }

          // Filter by containers if specified
          if (appliedFilters.containers) {
            const { min, max } = appliedFilters.containers;
            if (provider.maxContainers) {
              if (provider.maxContainers < min || provider.maxContainers > max) {
                return false;
              }
            }
          }

          return true;
        });
      }

      setFilteredServices(filtered);
    }

    // Filter packages
    if (packages?.length > 0) {
      let filtered = [...packages];

      if (SearchQuery.trim()) {
        filtered = filtered.filter((pkg) =>
          pkg?.title?.toLowerCase().includes(SearchQuery.toLowerCase())
        );
      }

      setFilteredPackages(filtered);
    }
  }, [currentService, SearchQuery, providers, packages, filter, appliedFilters]);

  // Smart popup logic
  useEffect(() => {
    const checkPopupDisplay = () => {
      const lastPopupTime = localStorage.getItem("lastPopupTime");
      const popupCount = parseInt(localStorage.getItem("popupCount") || "0");
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const threeDays = 3 * oneDay; // 3 days in milliseconds

      if (!user) {
        // User not logged in - show login popup
        if (!lastPopupTime || now - parseInt(lastPopupTime) > oneDay) {
          setIsPopup(true);
          localStorage.setItem("lastPopupTime", now.toString());
          localStorage.setItem("popupCount", (popupCount + 1).toString());
        }
      } else {
        // User is logged in - show contact GOL popup occasionally
        if (popupCount < 3) {
          // Show max 3 times
          if (!lastPopupTime || now - parseInt(lastPopupTime) > threeDays) {
            setShowContactGolPopup(true);
            localStorage.setItem("lastPopupTime", now.toString());
            localStorage.setItem("popupCount", (popupCount + 1).toString());
          }
        }
      }
    };

    // Delay popup display to avoid immediate popup on page load
    const timer = setTimeout(checkPopupDisplay, 2000);
    return () => clearTimeout(timer);
  }, [user]);

  const handlePopUpClose = () => {
    setIsPopup(false);
  };

  const handleContactGolPopupClose = () => {
    setShowContactGolPopup(false);
  };

  const handleFilterChange = (filterValues) => {
    setAppliedFilters(filterValues);
  };

  console.log("Search Queary", SearchQuery);

  return (
    <section className={`w-full h-auto items-center justify-center`}>
      {/* -- Services List -- */}
      {useIsMobile() ? (
        <MobileHeaderLayout
          currentService={currentService}
          setCurrentService={setCurrentService}
          user={user}
        />
      ) : (
        <HeaderLayout
          currentService={currentService}
          setCurrentService={setCurrentService}
          user={user}
        />
      )}

      <section className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">
            {currentService === "Custom"
              ? `${currentService} Packages`
              : `${currentService} Service Providers`}
          </h1>
          <Dialog
            trigger={
              <Button
                title={"Filters"}
                icon={<SlidersHorizontalIcon size={20} />}
                variant={""}
                iconPosition="right"
                className="rounded-md bg-[var(--primary)]"
              />
            }
            title="Filters"
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <FilterCFS openDialog={setIsOpen} onFilterChange={handleFilterChange} />
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4 w-full mt-10">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center justify-between relative gap-4 w-full">
              <Search className="absolute left-2 top-2 p-1 h-6 w-6 text-muted-foreground" />
              <input
                className={`flex pl-10 h-11 w-full bg-[var(--accent)] rounded-md border border-input text-[var(--foreground)] px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--foreground)] placeholder:text-[var(--secondary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                placeholder={
                  !useIsMobile()
                    ? (currentService === "Custom")
                      ? `Search ${currentService} Packages...`
                      : `Search ${currentService} Service Providers...`
                    : "Search"
                }
                value={SearchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value)}
              placeholder="-- Search By --"
              className="h-11"
            >
              <SelectItem value={"title"}> By Name </SelectItem>
              <SelectItem value={"location"}> By Location </SelectItem>
            </Select>
          </div>
        </div>

        {/* -- Providers List -- */}
        {currentService === "Custom" ? (
          <div className="flex flex-col md:gap-10 gap-4 pt-6">
            {filteredPackages.map((item) => (
              <PackageCard
                key={item?.id}
                title={item.title}
                rating={item?.rating || 0}
                description={item.description}
                services={item?.expand?.services}
                package_info={item}
                currentService={currentService}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col md:gap-10 gap-4 pt-6">
            {filteredServices.map((provider) => (
              <ServiceCard
                key={provider.id}
                title={provider.title}
                location={provider.location}
                rating={provider?.rating || 0}
                tags={parseTagsFromResponse(provider.tags)}
                description={provider.description}
                images={provider.files || []}
                id={provider.id}
                currentService={currentService}
              />
            ))}
          </div>
        )}
      </section>
      <Footer />
      {!user && isPopup && <LoginPopUp onOpen={handlePopUpClose} />}
      {user && showContactGolPopup && (
        <ContactGolPopup onClose={handleContactGolPopupClose} />
      )}
    </section>
  );
}

const ServiceCard = ({ title, location, rating, tags, description, images, id, currentService }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [images]);


  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleViewDetailsClick = () => {
    if (!user) {
      setShowLoginPopup(true);
    } else {
      router.push(`/customer/service-provider/${id}`);
    }
  };

  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
  };

  return (
    <div className="flex flex-col bg-[var(--accent)] md:flex-row rounded-lg shadow-md overflow-hidden border min-h-96 p-4 md:p-8 gap-10">
      {/* Left side - Image gallery with grid layout */}
      <div className="relative w-full md:w-2/5 h-80 md:h-96">
        {images?.length > 0 ? (
          <div className="flex gap-3 h-full">
            {/* Main large image */}
            <div className="relative flex-[2] rounded-xl overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{
                  width: `${images.length * 100}%`,
                  transform: `translateX(-${currentImageIndex * (100 / images.length)}%)`,
                }}
              >
                {images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={`${PB_URL}/api/files/service_provider/${id}/${img}`}
                    alt={`${title} - Image ${idx + 1}`}
                    width={5000}
                    height={5000}
                    className="w-full h-full object-cover"
                    style={{ width: `${100 / images.length}%` }}
                  />
                ))}
              </div>

              {/* Navigation buttons (unchanged) */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/80 text-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/80 text-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnail 2x2 grid */}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
      </div>

      {/* Right side - Information */}
      <div className="p-4 flex flex-col justify-between w-full md:w-3/5">
        <div>
          <h3 className="text-2xl font-semibold">{title}</h3>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="mr-1 w-5 h-5" />
            <span className="">{location}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
            {
              tags && tags.length > 0 ? tags.map((tag) => (
                <Button key={tag} title={tag} variant={'secondary'} className="rounded-md text-xs bg-[--var(--accent)]" />
              )) : (
                <span className="text-gray-500 text-xs italic">No tags available</span>
              )
            }
          </div>
          <div className="flex items-center mt-6">
            <RenderRatings rating={rating.toFixed(1)} />
            <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
          </div>
          <p className="mt-6">{description}</p>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <RequestPopup provider={id} service={currentService} />
          <Button
            title={'View Details'}
            variant={'outline'}
            className="rounded-md"
            onClick={handleViewDetailsClick}
          />
        </div>
      </div>

      {/* Login Popup for this specific service card */}
      {showLoginPopup && <LoginPopUp onOpen={handleLoginPopupClose} />}
    </div>
  );

}

const PackageCard = ({
  title,
  rating,
  services,
  description,
  package_info,
  currentService,
}) => {

  return (
    <div className="flex flex-col bg-[var(--accent)] md:flex-row rounded-lg shadow-md overflow-hidden border  p-4 md:p-8 gap-10">
      {/* Information */}
      <div className="p-4 flex flex-col justify-between w-full md:w-3/5">
        <div>
          <h3 className="text-2xl font-semibold">{title}</h3>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
            {services && services?.length > 0 ? (
              services.map((service) => (
                <Button
                  key={service?.id}
                  title={service?.title}
                  variant={"secondary"}
                  className="rounded-md text-xs bg-[--var(--accent)]"
                />
              ))
            ) : (
              <span className="text-gray-500 text-xs italic">
                No services available
              </span>
            )}
          </div>
          <div className="flex items-center mt-6">
            <RenderRatings rating={rating.toFixed(1)} />
            <span className="ml-1 text-sm text-gray-600">
              {rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-6">{description}</p>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <RequestPopup package_info={package_info} service={currentService} />
        </div>
      </div>
    </div>
  );
};
