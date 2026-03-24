import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/app";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [bannerData, setBannerData] = useState([]);
  const [workData, setWorkData] = useState([]);
  const [choseData, setChoseData] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [premiumProduct, setPremiumProduct] = useState([]);
  const [contactData, setContactData] = useState();

  // 🔥 fetch all landing APIs
  const fetchLandingData = async () => {
    try {
      const [
        bannerRes,
        workRes,
        choseRes,
        goalRes,
        categoryRes,
        productRes,
        contactRes,
        premiumRes,
      ] = await Promise.all([
        api.get("/banners"),
        api.get("/how-it-works"),
        api.get("/why-choose-us"),
        api.get("/goals"),
        api.get("/category"),
        api.get("/products"),
        api.get("/website-settings"),
        api.get("/premium-product"),
      ]);

      setBannerData(bannerRes.data.data);
      setWorkData(workRes.data.data);
      setChoseData(choseRes.data.data);
      setGoalData(goalRes.data.data);
      setCategoryData(categoryRes.data.data);
      setProductData(productRes.data.data);
      setContactData(contactRes.data.data.settings)
      setPremiumProduct(premiumRes.data.data);
    } catch (error) {
      console.error("Landing API Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandingData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading,
        bannerData,
        workData,
        choseData,
        goalData,
        categoryData,
        productData,
        contactData,
        premiumProduct,
        fetchLandingData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);