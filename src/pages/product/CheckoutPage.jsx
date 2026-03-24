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
          
          // Pre-fill receiver info if available
          if (orderResponse.data.data.receiver_name) {
            setFormData(prev => ({
              ...prev,
              receiver_name: orderResponse.data.data.receiver_name || '',
              receiver_phone: orderResponse.data.data.receiver_phone || '',
              address: orderResponse.data.data.address || '',
              city: orderResponse.data.data.city || '',
              state: orderResponse.data.data.state || '',
              pincode: orderResponse.data.data.pincode || ''
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
        color: 'var(--color-primary)',
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
  const getProductImage = (item) => {
    if (item.product.images && item.product.images.length > 0) {
      const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
      const thumbnail = item.product.images.find(img => img.is_thumbnail === 1);
      if (thumbnail) {
        return `${storageUrl}/${thumbnail.image}`;
      }
      return `${storageUrl}/${item.product.images[0].image}`;
    }
    return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop";
  };

  // Get product name with variant
  const getProductDisplayName = (item) => {
    if (item.variant) {
      return `${item.product.name} - ${item.variant.variant_name}`;
    }
    return item.product.name;
  };

  // Get product price display
  const getProductPrice = (item) => {
    return parseFloat(item.price);
  };

  // Calculate totals
  const calculateTotal = () => {
    if (!orderData) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    
    const subtotal = parseFloat(orderData.total_amount);
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
      <div className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40 bg-main">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary-light border border-primary/30">
                <Lock size={24} className="text-brand" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                  Secure Checkout
                </h1>
                <p className="text-lg text-muted">
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
                        ? 'scale-110 shadow-primary' 
                        : 'opacity-50'
                    }`}
                      style={{
                        backgroundColor: step >= stepItem.number ? 'var(--color-primary)' : 'var(--bg-card)',
                        border: `2px solid ${step >= stepItem.number ? 'var(--color-primary)' : 'var(--bg-border)'}`,
                      }}
                    >
                      <stepItem.icon 
                        size={20} 
                        style={{ 
                          color: step >= stepItem.number ? 'var(--text-primary)' : 'var(--text-muted)' 
                        }}
                      />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      step >= stepItem.number ? 'text-primary' : 'text-muted'
                    }`}>
                      {stepItem.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-4 relative">
                      <div className="absolute inset-0 bg-border rounded-full" />
                      <div 
                        className="absolute inset-0 rounded-full transition-all duration-500"
                        style={{
                          width: step > stepItem.number ? '100%' : '0%',
                          backgroundColor: 'var(--color-primary)',
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
                    <div className="p-2 rounded-lg bg-primary-light">
                      <Truck size={20} className="text-brand" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">
                      Delivery Information
                    </h2>
                  </div>

                  <div className="rounded-2xl p-6 mb-6 bg-card border border-theme">
                    <form className="space-y-6">
                      {/* Receiver Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">
                          Receiver Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
                          <input
                            type="text"
                            name="receiver_name"
                            value={formData.receiver_name}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-all bg-main border-theme text-primary"
                            style={{
                              border: `1px solid var(--bg-border)`,
                            }}
                            placeholder="Ranjan Sharma"
                            required
                          />
                        </div>
                      </div>

                      {/* Receiver Phone */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">
                          Receiver Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
                          <input
                            type="tel"
                            name="receiver_phone"
                            value={formData.receiver_phone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-all bg-main border-theme text-primary"
                            style={{
                              border: `1px solid var(--bg-border)`,
                            }}
                            placeholder="9876543210"
                            required
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">
                          Address *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-muted" size={18} />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-all resize-none bg-main border-theme text-primary"
                            style={{
                              border: `1px solid var(--bg-border)`,
                            }}
                            placeholder="Salt Lake Sector 5"
                            required
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-all bg-main border-theme text-primary"
                          style={{
                            border: `1px solid var(--bg-border)`,
                          }}
                          placeholder="Kolkata"
                          required
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-all bg-main border-theme text-primary"
                          style={{
                            border: `1px solid var(--bg-border)`,
                          }}
                          placeholder="West Bengal"
                          required
                        />
                      </div>

                      {/* PIN Code */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-all bg-main border-theme text-primary"
                          style={{
                            border: `1px solid var(--bg-border)`,
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
                          className="w-4 h-4 rounded bg-main border-theme"
                          style={{
                            accentColor: 'var(--color-primary)',
                          }}
                        />
                        <label htmlFor="save-info" className="text-sm text-muted">
                          Save this information for next time
                        </label>
                      </div>
                    </form>
                  </div>

                  <div className="flex justify-between">
                    <Link 
                      to="/cart"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5 text-primary border border-theme"
                    >
                      <ArrowLeft size={18} />
                      Back to Cart
                    </Link>
                    <button
                      onClick={() => setStep(2)}
                      className="px-8 py-3 rounded-lg font-semibold text-primary transition-all hover:shadow-primary-hover bg-gradient-primary"
                    >
                      Continue to Payment
                      <ChevronRight size={18} className="inline ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary-light">
                      <CreditCard size={20} className="text-brand" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">
                      Select Payment Method
                    </h2>
                  </div>

                  <div className="rounded-2xl p-6 mb-6 bg-card border border-theme">
                    {/* Payment Options */}
                    <div className="space-y-4 mb-8">
                      {/* Razorpay Option */}
                      <label
                        className={`flex items-center gap-4 p-6 rounded-lg cursor-pointer transition-all border-2 ${
                          paymentMethod === 'razorpay' 
                            ? 'border-brand bg-primary-light' 
                            : 'border-theme hover:border-brand/50'
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
                            accentColor: 'var(--color-primary)',
                          }}
                        />
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary-light border border-brand">
                            <Wallet size={24} className="text-brand" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-primary mb-1">
                              Razorpay
                            </h3>
                            <p className="text-sm text-muted">
                              Pay via Credit/Debit Card, UPI, Net Banking, Wallet
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-brand text-primary rounded-full">
                            Recommended
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Payment Features for Razorpay */}
                    {paymentMethod === 'razorpay' && (
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 rounded-lg bg-primary-light">
                          <p className="text-xs text-primary font-medium">100% Secure</p>
                          <p className="text-xs text-muted">SSL Encrypted</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary-light">
                          <p className="text-xs text-primary font-medium">Fast Checkout</p>
                          <p className="text-xs text-muted">One-click payments</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary-light">
                          <p className="text-xs text-primary font-medium">Multiple Options</p>
                          <p className="text-xs text-muted">Cards, UPI, Wallets</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary-light">
                          <p className="text-xs text-primary font-medium">Instant Refunds</p>
                          <p className="text-xs text-muted">Easy returns</p>
                        </div>
                      </div>
                    )}

                    {/* Security Note */}
                    <div className="p-4 rounded-lg flex items-start gap-3 bg-success/10 border border-success/30">
                      <Shield size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-success">
                        Your payment is secure and encrypted. We never store your card details.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5 text-primary border border-theme"
                    >
                      <ArrowLeft size={18} />
                      Back to Delivery
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-8 py-3 rounded-lg font-semibold text-primary transition-all hover:shadow-primary-hover bg-gradient-primary"
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
                    <div className="p-2 rounded-lg bg-primary-light">
                      <CheckCircle size={20} className="text-brand" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">
                      Order Confirmation
                    </h2>
                  </div>

                  <div className="rounded-2xl p-6 mb-6 bg-card border border-theme">
                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-primary">
                          Order Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted">Order ID</span>
                            <span className="text-primary">#{orderData?.order_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted">Order Date</span>
                            <span className="text-primary">
                              {new Date(orderData?.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted">Payment Method</span>
                            <span className="text-primary capitalize">
                              {paymentMethod === 'razorpay' ? 'Razorpay (Online Payment)' : 'Cash on Delivery'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted">Estimated Delivery</span>
                            <span className="text-success">3-5 business days</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address Summary */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-primary">
                          Delivery Address
                        </h3>
                        <p className="text-sm text-muted">
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
                            className="w-4 h-4 mt-1 rounded bg-main border-theme"
                            style={{
                              accentColor: 'var(--color-primary)',
                            }}
                          />
                          <label htmlFor="terms" className="text-sm text-muted">
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
                            className="w-4 h-4 mt-1 rounded bg-main border-theme"
                            style={{
                              accentColor: 'var(--color-primary)',
                            }}
                          />
                          <label htmlFor="warranty" className="text-sm text-muted">
                            I understand the 2-year warranty terms and conditions
                          </label>
                        </div>
                      </div>

                      {/* Final Note */}
                      <div className="p-4 rounded-lg bg-primary-light border border-primary/30">
                        <div className="flex items-start gap-3">
                          <AlertCircle size={16} className="text-brand mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-primary">
                            By placing this order, you agree to receive email and SMS updates about your order status.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5 text-primary border border-theme"
                      disabled={processing}
                    >
                      <ArrowLeft size={18} />
                      Back to Payment
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing || !formData.agreeTerms || !formData.agreeWarranty}
                      className="px-8 py-3 rounded-lg font-semibold text-primary transition-all hover:shadow-primary-hover hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-gradient-primary"
                      style={{
                        boxShadow: `0 0 40px var(--color-primary-glow)`,
                      }}
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
              <div className="rounded-2xl overflow-hidden sticky top-24 bg-card border border-theme">
                {/* Header */}
                <div className="p-6 border-b border-theme bg-gradient-to-r from-primary-light to-transparent">
                  <h3 className="text-xl font-bold text-primary">
                    Order Summary
                  </h3>
                  <p className="text-sm mt-1 text-muted">
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
                            src={getProductImage(item)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1 text-primary">
                            {getProductDisplayName(item)}
                          </h4>
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <span className="text-muted">Qty: {item.qty}</span>
                            {item.variant && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-muted" />
                                <span className="text-muted">{item.variant.color} / {item.variant.size}</span>
                              </>
                            )}
                          </div>
                          {item.product.sale_price && !item.variant && (
                            <div className="text-xs text-muted">
                              Was: ₹{parseFloat(item.product.price).toLocaleString()}
                            </div>
                          )}
                          {item.variant && parseFloat(item.variant.price) > parseFloat(item.price) && (
                            <div className="text-xs text-muted">
                              Was: ₹{parseFloat(item.variant.price).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            ₹{(parseFloat(item.price) * item.qty).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted">
                            ₹{parseFloat(item.price).toLocaleString()} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-6 border-t border-theme">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted">Subtotal</span>
                      <span className="text-primary">₹{totals.subtotal.toLocaleString()}</span>
                    </div>
                    
                    {totals.subtotal > 2000 && (
                      <div className="flex justify-between">
                        <span className="text-success">Shipping Discount</span>
                        <span className="text-success">-₹199</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-theme">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">
                          Total Amount
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ₹{totals.total.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted">
                            Includes all taxes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="p-6 border-t border-theme bg-primary-light/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Truck size={18} className="text-brand" />
                    <h4 className="font-semibold text-primary">
                      Delivery Information
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-muted" />
                      <span className="text-sm text-muted">
                        Estimated Delivery: 3-5 business days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-muted" />
                      <span className="text-sm text-muted">
                        Free shipping on orders above ₹2,000
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-muted" />
                      <span className="text-sm text-muted">
                        All orders include 2-year warranty
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help Section */}
              <div className="mt-6 p-6 rounded-2xl bg-card border border-theme">
                <h4 className="font-semibold mb-3 text-primary">
                  Need Help?
                </h4>
                <p className="text-sm mb-4 text-muted">
                  Contact our support team for assistance with your order.
                </p>
                <button className="w-full py-3 rounded-lg font-medium transition-all hover:bg-white/5 text-primary border border-theme">
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