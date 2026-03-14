import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  CreditCard, Truck, Shield, Lock, CheckCircle,
  ChevronRight, MapPin, Package, Clock, ArrowLeft,
  User, Mail, Phone, Plus, Trash2, AlertCircle, Wallet, DollarSign
} from 'lucide-react';
import PageLoader from '../../component/common/PageLoader';
import PageHelmet from '../../component/common/PageHelmet';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/app';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [saveInfo, setSaveInfo] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [razorpayData, setRazorpayData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState(null);

  // Form state - matching API requirements
  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    agreeTerms: false,
    agreeWarranty: false
  });

  // Color Schema
  const colors = {
    primary: "#E10600",
    background: "#0B0B0B",
    cardBg: "#141414",
    border: "#262626",
    text: "#FFFFFF",
    muted: "#B3B3B3",
    success: "#22C55E",
    warning: "#FACC15",
  };

  // Fetch order data based on ID
  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        // Fetch order details
        const orderResponse = await api.get(`/user/order/details/${id}`);
        if (orderResponse.data?.status) {
          setOrderData(orderResponse.data.data);
          
          // Pre-fill user data if available
          if (user) {
            setFormData(prev => ({
              ...prev,
              receiver_name: user.name || '',
              receiver_phone: user.phone || ''
            }));
          }
        } else {
          toast.error('Order not found');
          navigate('/cart');
        }

        // Fetch Razorpay order data
        const razorpayResponse = await api.get(`/user/payment/razorpay/${id}`);
        if (razorpayResponse.data?.status) {
          setRazorpayData(razorpayResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
        toast.error('Failed to load order details');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderData();
    }
  }, [id, user, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create checkout order
  const createCheckoutOrder = async () => {
    // Validate form data
    if (!formData.receiver_name || !formData.receiver_phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill in all delivery information');
      setStep(1);
      return null;
    }

    if (!formData.agreeTerms || !formData.agreeWarranty) {
      toast.error('Please agree to terms and conditions');
      return null;
    }

    try {
      const payload = {
        receiver_name: formData.receiver_name,
        receiver_phone: formData.receiver_phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        payment_method: paymentMethod
      };

      const response = await api.post(`/user/checkout/${id}`, payload);
      
      if (response.data?.status) {
        setCheckoutOrderId(response.data.data.id);
        return response.data.data;
      } else {
        toast.error('Failed to create order');
        return null;
      }
    } catch (error) {
      console.error('Error creating checkout order:', error);
      toast.error('Failed to create order');
      return null;
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    // First create the checkout order
    const checkoutData = await createCheckoutOrder();
    
    if (!checkoutData) {
      setProcessing(false);
      return;
    }

    if (!razorpayData) {
      toast.error('Payment initialization failed');
      return;
    }

    setProcessing(true);

    const options = {
      key: razorpayData.key,
      amount: Math.round(parseFloat(checkoutData.total_amount) * 100), // Amount in paise
      currency: "INR",
      name: "ONE REP MORE",
      description: `Order #${checkoutData.order_number}`,
      order_id: razorpayData.razorpay_order_id,
      handler: function(response) {
        // Handle successful payment
        handlePaymentSuccess(response, checkoutData.id);
      },
      prefill: {
        name: formData.receiver_name,
        email: user?.email || '',
        contact: formData.receiver_phone,
      },
      notes: {
        order_id: checkoutData.id,
        order_number: checkoutData.order_number
      },
      theme: {
        color: colors.primary,
      },
      modal: {
        ondismiss: function() {
          setProcessing(false);
          toast.info('Payment cancelled');
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Handle payment success
  const handlePaymentSuccess = async (response, orderId) => {
    console.log("Response Data:: ",response)
    try {
      // Verify payment on backend
      const verifyPayload = {
        order_id: orderId.toString(),
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      };

      const verifyResponse = await api.post(`/user/payment/verify`, verifyPayload);

      if (verifyResponse.data?.status) {
        toast.success('Payment successful!');
        navigate('/order-successful', { 
          state: { 
            orderId: orderId,
            orderNumber: orderData.order_number 
          }
        });
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed');
    } finally {
      setProcessing(false);
    }
  };

  // Handle COD order placement
  const handleCODOrder = async () => {
    // Create checkout order first
    const checkoutData = await createCheckoutOrder();
    
    if (!checkoutData) {
      return;
    }

    setProcessing(true);
    try {
      // For COD, we don't need payment verification
      toast.success('Order placed successfully!');
      navigate('/order-successful', {
        state: {
          orderId: checkoutData.id,
          orderNumber: checkoutData.order_number,
          paymentMethod: 'cod'
        }
      });
    } catch (error) {
      console.error('Error placing COD order:', error);
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  // Handle final order placement based on payment method
  const handlePlaceOrder = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleCODOrder();
    }
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
      const thumbnail = product.images.find(img => img.is_thumbnail === 1);
      if (thumbnail) {
        return `${storageUrl}/${thumbnail.image}`;
      }
      return `${storageUrl}/${product.images[0].image}`;
    }
    return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop";
  };

  // Calculate totals
  const calculateTotal = () => {
    if (!orderData) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    
    const subtotal = parseFloat(orderData.total_amount);
    // const shipping = subtotal > 2000 ? 0 : 199;
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  const steps = [
    { number: 1, title: "Delivery", icon: Truck },
    { number: 2, title: "Payment", icon: CreditCard },
    { number: 3, title: "Confirm", icon: CheckCircle }
  ];

  const totals = calculateTotal();

  if (loading) return <PageLoader />;

  return (
    <>
      <PageHelmet title="Checkout - ONE REP MORE" />
      <div style={{ backgroundColor: colors.background }} className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <Lock size={24} style={{ color: colors.primary }} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.text }}>
                  Secure Checkout
                </h1>
                <p className="text-lg" style={{ color: colors.muted }}>
                  Order #{orderData?.order_number}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-12 relative">
              {steps.map((stepItem, index) => (
                <React.Fragment key={stepItem.number}>
                  <div className="flex flex-col items-center relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                      step >= stepItem.number 
                        ? 'scale-110 shadow-lg' 
                        : 'opacity-50'
                    }`}
                      style={{
                        backgroundColor: step >= stepItem.number ? colors.primary : colors.cardBg,
                        border: `2px solid ${step >= stepItem.number ? colors.primary : colors.border}`,
                      }}
                    >
                      <stepItem.icon 
                        size={20} 
                        style={{ 
                          color: step >= stepItem.number ? colors.text : colors.muted 
                        }}
                      />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      step >= stepItem.number ? 'text-white' : 'text-[#B3B3B3]'
                    }`}>
                      {stepItem.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-4 relative">
                      <div className="absolute inset-0 bg-[#262626] rounded-full" />
                      <div 
                        className="absolute inset-0 rounded-full transition-all duration-500"
                        style={{
                          width: step > stepItem.number ? '100%' : '0%',
                          backgroundColor: colors.primary,
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Forms */}
            <div className="space-y-8">
              {/* Step 1: Delivery Information */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
                      <Truck size={20} style={{ color: colors.primary }} />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                      Delivery Information
                    </h2>
                  </div>

                  <div 
                    className="rounded-2xl p-6 mb-6"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <form className="space-y-6">
                      {/* Receiver Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          Receiver Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: colors.muted }} />
                          <input
                            type="text"
                            name="receiver_name"
                            value={formData.receiver_name}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                            style={{
                              backgroundColor: colors.background,
                              border: `1px solid ${colors.border}`,
                              color: colors.text,
                            }}
                            placeholder="Ranjan Sharma"
                            required
                          />
                        </div>
                      </div>

                      {/* Receiver Phone */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          Receiver Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: colors.muted }} />
                          <input
                            type="tel"
                            name="receiver_phone"
                            value={formData.receiver_phone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                            style={{
                              backgroundColor: colors.background,
                              border: `1px solid ${colors.border}`,
                              color: colors.text,
                            }}
                            placeholder="9876543210"
                            required
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          Address *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3" size={18} style={{ color: colors.muted }} />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all resize-none"
                            style={{
                              backgroundColor: colors.background,
                              border: `1px solid ${colors.border}`,
                              color: colors.text,
                            }}
                            placeholder="Salt Lake Sector 5"
                            required
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="Kolkata"
                          required
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="West Bengal"
                          required
                        />
                      </div>

                      {/* PIN Code */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="700091"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="save-info"
                          checked={saveInfo}
                          onChange={(e) => setSaveInfo(e.target.checked)}
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.primary,
                          }}
                        />
                        <label htmlFor="save-info" className="text-sm" style={{ color: colors.muted }}>
                          Save this information for next time
                        </label>
                      </div>
                    </form>
                  </div>

                  <div className="flex justify-between">
                    <Link 
                      to="/cart"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5"
                      style={{
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <ArrowLeft size={18} />
                      Back to Cart
                    </Link>
                    <button
                      onClick={() => setStep(2)}
                      className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                      }}
                    >
                      Continue to Payment
                      <ChevronRight size={18} className="inline ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method - Razorpay and COD */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
                      <CreditCard size={20} style={{ color: colors.primary }} />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                      Select Payment Method
                    </h2>
                  </div>

                  <div 
                    className="rounded-2xl p-6 mb-6"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {/* Payment Options */}
                    <div className="space-y-4 mb-8">
                      {/* Razorpay Option */}
                      <label
                        className={`flex items-center gap-4 p-6 rounded-lg cursor-pointer transition-all border-2 ${
                          paymentMethod === 'razorpay' 
                            ? 'border-[#E10600] bg-[#E10600]/10' 
                            : 'border-[#262626] hover:border-[#E10600]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={paymentMethod === 'razorpay'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5"
                          style={{
                            color: colors.primary,
                          }}
                        />
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${colors.primary}20`,
                              border: `1px solid ${colors.primary}`,
                            }}
                          >
                            <Wallet size={24} style={{ color: colors.primary }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                              Razorpay
                            </h3>
                            <p className="text-sm" style={{ color: colors.muted }}>
                              Pay via Credit/Debit Card, UPI, Net Banking, Wallet
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-[#E10600] text-white rounded-full">
                            Recommended
                          </span>
                        </div>
                      </label>

                      {/* COD Option */}
                      {/* <label
                        className={`flex items-center gap-4 p-6 rounded-lg cursor-pointer transition-all border-2 ${
                          paymentMethod === 'cod' 
                            ? 'border-[#E10600] bg-[#E10600]/10' 
                            : 'border-[#262626] hover:border-[#E10600]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5"
                          style={{
                            color: colors.primary,
                          }}
                        />
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${colors.primary}20`,
                              border: `1px solid ${colors.primary}`,
                            }}
                          >
                            <DollarSign size={24} style={{ color: colors.primary }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                              Cash on Delivery
                            </h3>
                            <p className="text-sm" style={{ color: colors.muted }}>
                              Pay with cash when your order is delivered
                            </p>
                          </div>
                        </div>
                      </label> */}
                    </div>

                    {/* Payment Features for Razorpay */}
                    {paymentMethod === 'razorpay' && (
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                          <p className="text-xs text-white font-medium">100% Secure</p>
                          <p className="text-xs" style={{ color: colors.muted }}>SSL Encrypted</p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                          <p className="text-xs text-white font-medium">Fast Checkout</p>
                          <p className="text-xs" style={{ color: colors.muted }}>One-click payments</p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                          <p className="text-xs text-white font-medium">Multiple Options</p>
                          <p className="text-xs" style={{ color: colors.muted }}>Cards, UPI, Wallets</p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                          <p className="text-xs text-white font-medium">Instant Refunds</p>
                          <p className="text-xs" style={{ color: colors.muted }}>Easy returns</p>
                        </div>
                      </div>
                    )}

                    {/* COD Info */}
                    {paymentMethod === 'cod' && (
                      <div 
                        className="p-4 rounded-lg mb-6"
                        style={{
                          backgroundColor: `${colors.warning}10`,
                          border: `1px solid ${colors.warning}30`,
                        }}
                      >
                        <p className="text-sm" style={{ color: colors.warning }}>
                          <span className="font-bold">Note:</span> Cash on Delivery orders require exact change. 
                          A nominal fee of ₹50 may be applicable for orders below ₹500.
                        </p>
                      </div>
                    )}

                    {/* Security Note */}
                    <div 
                      className="p-4 rounded-lg flex items-start gap-3"
                      style={{
                        backgroundColor: `${colors.success}10`,
                        border: `1px solid ${colors.success}30`,
                      }}
                    >
                      <Shield size={16} style={{ color: colors.success }} className="mt-0.5 flex-shrink-0" />
                      <p className="text-sm" style={{ color: colors.success }}>
                        Your payment is secure and encrypted. We never store your card details.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5"
                      style={{
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <ArrowLeft size={18} />
                      Back to Delivery
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                      }}
                    >
                      Review Order
                      <ChevronRight size={18} className="inline ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Confirmation */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
                      <CheckCircle size={20} style={{ color: colors.primary }} />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                      Order Confirmation
                    </h2>
                  </div>

                  <div 
                    className="rounded-2xl p-6 mb-6"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                          Order Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span style={{ color: colors.muted }}>Order ID</span>
                            <span style={{ color: colors.text }}>#{orderData?.order_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: colors.muted }}>Order Date</span>
                            <span style={{ color: colors.text }}>
                              {new Date(orderData?.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: colors.muted }}>Payment Method</span>
                            <span style={{ color: colors.text }} className="capitalize">
                              {paymentMethod === 'razorpay' ? 'Razorpay (Online Payment)' : 'Cash on Delivery'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: colors.muted }}>Estimated Delivery</span>
                            <span style={{ color: colors.success }}>3-5 business days</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address Summary */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                          Delivery Address
                        </h3>
                        <p className="text-sm" style={{ color: colors.muted }}>
                          <span className="font-medium">Receiver:</span> {formData.receiver_name}<br />
                          <span className="font-medium">Phone:</span> {formData.receiver_phone}<br />
                          {formData.address}<br />
                          {formData.city}, {formData.state} - {formData.pincode}
                        </p>
                      </div>

                      {/* Terms Agreement */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="terms"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            className="w-4 h-4 mt-1 rounded"
                            style={{
                              backgroundColor: colors.background,
                              borderColor: colors.border,
                              color: colors.primary,
                            }}
                          />
                          <label htmlFor="terms" className="text-sm" style={{ color: colors.muted }}>
                            I agree to the Terms of Service and Privacy Policy
                          </label>
                        </div>
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="warranty"
                            name="agreeWarranty"
                            checked={formData.agreeWarranty}
                            onChange={handleInputChange}
                            className="w-4 h-4 mt-1 rounded"
                            style={{
                              backgroundColor: colors.background,
                              borderColor: colors.border,
                              color: colors.primary,
                            }}
                          />
                          <label htmlFor="warranty" className="text-sm" style={{ color: colors.muted }}>
                            I understand the 2-year warranty terms and conditions
                          </label>
                        </div>
                      </div>

                      {/* Final Note */}
                      <div 
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: `${colors.primary}10`,
                          border: `1px solid ${colors.primary}30`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle size={16} style={{ color: colors.primary }} className="mt-0.5 flex-shrink-0" />
                          <p className="text-sm" style={{ color: colors.text }}>
                            By placing this order, you agree to receive email and SMS updates about your order status.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5"
                      style={{
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                      disabled={processing}
                    >
                      <ArrowLeft size={18} />
                      Back to Payment
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing || !formData.agreeTerms || !formData.agreeWarranty}
                      className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                        boxShadow: `0 0 40px ${colors.primary}40`,
                      }}
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {paymentMethod === 'razorpay' ? (
                            <>
                              <Wallet size={18} />
                              Pay with Razorpay
                            </>
                          ) : (
                            <>
                              <DollarSign size={18} />
                              Place Order (COD)
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Cart */}
            <div>
              <div 
                className="rounded-2xl overflow-hidden sticky top-24"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* Header */}
                <div 
                  className="p-6 border-b"
                  style={{ 
                    borderColor: colors.border,
                    background: `linear-gradient(135deg, ${colors.primary}20, transparent)`
                  }}
                >
                  <h3 className="text-xl font-bold" style={{ color: colors.text }}>
                    Order Summary
                  </h3>
                  <p className="text-sm mt-1" style={{ color: colors.muted }}>
                    {orderData?.items?.length || 0} {orderData?.items?.length === 1 ? 'item' : 'items'} in your order
                  </p>
                </div>

                {/* Cart Items */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {orderData?.items?.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getProductImage(item.product)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1" style={{ color: colors.text }}>
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm">
                            <span style={{ color: colors.muted }}>Qty: {item.qty}</span>
                            {item.product.sale_price && (
                              <span style={{ color: colors.muted }}>
                                Was: ₹{parseFloat(item.product.price).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold" style={{ color: colors.text }}>
                            ₹{(parseFloat(item.price) * item.qty).toLocaleString()}
                          </div>
                          <div className="text-sm" style={{ color: colors.muted }}>
                            ₹{parseFloat(item.price).toLocaleString()} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-6 border-t" style={{ borderColor: colors.border }}>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span style={{ color: colors.muted }}>Subtotal</span>
                      <span style={{ color: colors.text }}>₹{totals.subtotal.toLocaleString()}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span style={{ color: colors.muted }}>Shipping</span>
                      <span style={{ color: totals.shipping === 0 ? colors.success : colors.text }}>
                        {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
                      </span>
                    </div> */}
                    
                    {totals.subtotal > 2000 && (
                      <div className="flex justify-between">
                        <span style={{ color: colors.success }}>Shipping Discount</span>
                        <span style={{ color: colors.success }}>-₹199</span>
                      </div>
                    )}

                    <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold" style={{ color: colors.text }}>
                          Total Amount
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: colors.text }}>
                            ₹{totals.total.toLocaleString()}
                          </div>
                          <div className="text-sm" style={{ color: colors.muted }}>
                            Includes all taxes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div 
                  className="p-6 border-t"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: `${colors.primary}05`
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Truck size={18} style={{ color: colors.primary }} />
                    <h4 className="font-semibold" style={{ color: colors.text }}>
                      Delivery Information
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} style={{ color: colors.muted }} />
                      <span className="text-sm" style={{ color: colors.muted }}>
                        Estimated Delivery: 3-5 business days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={14} style={{ color: colors.muted }} />
                      <span className="text-sm" style={{ color: colors.muted }}>
                        Free shipping on orders above ₹2,000
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={14} style={{ color: colors.muted }} />
                      <span className="text-sm" style={{ color: colors.muted }}>
                        All orders include 2-year warranty
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help Section */}
              <div 
                className="mt-6 p-6 rounded-2xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h4 className="font-semibold mb-3" style={{ color: colors.text }}>
                  Need Help?
                </h4>
                <p className="text-sm mb-4" style={{ color: colors.muted }}>
                  Contact our support team for assistance with your order.
                </p>
                <button className="w-full py-3 rounded-lg font-medium transition-all hover:bg-white/5"
                  style={{
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;