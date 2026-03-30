import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, MapPin, Clock, ChevronRight, Plus, Minus, X, Search, CheckCircle2, Star, Utensils } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// --- Types ---
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  popular?: boolean;
};

type CartItem = MenuItem & { quantity: number };

// --- Mock Data ---
const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Arancini',
    description: 'Crispy risotto balls stuffed with mozzarella and black truffle, served with garlic aioli.',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1626804475297-41609ea0b4eb?auto=format&fit=crop&q=80&w=800',
    category: 'Starters',
    tags: ['Vegetarian'],
    popular: true,
  },
  {
    id: '2',
    name: 'Spicy Tuna Tartare',
    description: 'Fresh yellowfin tuna, avocado, chili oil, and crispy wonton chips.',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=800',
    category: 'Starters',
    tags: ['Spicy', 'Gluten-Free'],
  },
  {
    id: '6',
    name: 'Artisan Burrata',
    description: 'Creamy burrata cheese, heirloom tomatoes, balsamic glaze, and toasted pine nuts.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=800',
    category: 'Starters',
    tags: ['Vegetarian'],
  },
  {
    id: '3',
    name: 'Wood-Fired Margherita',
    description: 'San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    category: 'Mains',
    tags: ['Vegetarian'],
    popular: true,
  },
  {
    id: '4',
    name: 'Wagyu Beef Burger',
    description: '8oz Wagyu patty, caramelized onions, gruyere cheese, truffle mayo on a brioche bun.',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    category: 'Mains',
    tags: [],
    popular: true,
  },
  {
    id: '5',
    name: 'Miso Glazed Black Cod',
    description: 'Sustainably caught black cod marinated in sweet miso, served with bok choy.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    category: 'Mains',
    tags: ['Gluten-Free'],
  },
  {
    id: '9',
    name: 'Handmade Pappardelle',
    description: 'Slow-cooked wild boar ragu, parmigiano reggiano, and fresh herbs.',
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800',
    category: 'Mains',
    tags: [],
  },
  {
    id: '7',
    name: 'Matcha Tiramisu',
    description: 'Layers of matcha-soaked ladyfingers and mascarpone cream.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800',
    category: 'Desserts',
    tags: ['Vegetarian'],
  },
  {
    id: '10',
    name: 'Dark Chocolate Lava Cake',
    description: 'Warm molten center, served with vanilla bean gelato and fresh berries.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
    category: 'Desserts',
    tags: ['Vegetarian'],
    popular: true,
  },
  {
    id: '8',
    name: 'Craft Negroni',
    description: 'Gin, Campari, sweet vermouth, orange peel.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
    category: 'Drinks',
    tags: ['Alcoholic'],
  },
  {
    id: '11',
    name: 'Yuzu Spritz',
    description: 'Yuzu juice, prosecco, sparkling water, mint.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    category: 'Drinks',
    tags: ['Alcoholic'],
  },
  {
    id: '12',
    name: 'Classic Lemon Cheesecake',
    description: 'New York style cheesecake with a graham cracker crust and mixed berry compote.',
    price: 11.00,
    image: 'https://images.unsplash.com/photo-1524351199678-961d65a8dfde?auto=format&fit=crop&q=80&w=800',
    category: 'Desserts',
    tags: ['Vegetarian'],
  },
  {
    id: '13',
    name: 'Local Craft IPA',
    description: 'A hazy, cold-fermented IPA from the closest local brewery.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&q=80&w=800',
    category: 'Drinks',
    tags: ['Alcoholic'],
  },
  {
    id: '14',
    name: 'Lavender Lemonade',
    description: 'Fresh squeezed lemons, lavender, and a hint of organic honey.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    category: 'Drinks',
    tags: [],
  },
];

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks'];
const TIPS = [0.10, 0.15, 0.20];

export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('menucraft_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse cart JSON');
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout State
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [tipPercentage, setTipPercentage] = useState(TIPS[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('');
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    localStorage.setItem('menucraft_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to cart`, {
      style: { background: '#8C3A21', color: '#fff', border: 'none' },
      icon: <Utensils size={16} />
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  
  const cartTax = cartSubtotal * 0.08;
  const cartTip = cartSubtotal * tipPercentage;
  const cartTotal = cartSubtotal + cartTax + cartTip;

  const handleCheckout = async () => {
    if (!customerPhone.trim()) {
      toast.error('Please enter your phone number to proceed.');
      return;
    }
    
    // Pattern: Normalize local phone number by automatically adding +91 (country code) if omitted.
    let formattedPhone = customerPhone.trim();
    if (/^\d{10}$/.test(formattedPhone)) {
      formattedPhone = '91' + formattedPhone;
    } else {
      formattedPhone = formattedPhone.replace('+', '');
    }

    setIsProcessing(true);
    setCheckoutStep('Opening WhatsApp to message client...');

    try {
      // 1. Prepare Order Messages
      const orderSummary = cart.map(item => `${item.quantity}x ${item.name}`).join('\\n');
      const timeEstimate = Math.floor(Math.random() * 15) + 20; // 20-35 mins
      
      const clientMessage = `*Order Confirmed!* 🍔\\n\\nHi from MenuCraft! We've received your order and are preparing it right away.\\n\\n*Your Order:*\\n${orderSummary}\\n\\n*Total Paid:* $${cartTotal.toFixed(2)}\\n*Est. Ready Time:* ${timeEstimate} minutes\\n\\nThank you for choosing us! Reply to this message if you have any questions.`;

      // 2. Open WhatsApp link dynamically targeted at the Customer's Phone number
      // So the restaurant (you, clicking the button) sends the message TO the client via WhatsApp
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(clientMessage)}`, '_blank');

      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsProcessing(false);
      setIsCheckoutSuccess(true);
      
      setTimeout(() => {
        setCart([]);
        setIsCartOpen(false);
        setIsCheckoutSuccess(false);
        setOrderNotes('');
        setCustomerPhone('');
        setTipPercentage(TIPS[1]);
        localStorage.removeItem('menucraft_cart');
        toast.success('WhatsApp opened to confirm with client!');
      }, 3000);

    } catch (err) {
      console.error('Failed to route messages:', err);
      setIsProcessing(false);
      toast.error('Something went wrong during message routing.');
    }
  };

  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const filteredItems = useMemo(() => {
    if (searchQuery.trim()) {
      return MENU_ITEMS.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return MENU_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3D2B1F] font-sans pb-24 overflow-x-hidden">
      <Toaster position="top-center" />
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-[40vh] min-h-[300px] w-full bg-[#3D2B1F]">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200" 
          alt="Restaurant Interior" 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-black/40" />
        
        {/* Dynamic Header */}
        <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-serif font-bold transition-colors ${isScrolled ? 'text-[#8C3A21]' : 'text-white drop-shadow-md'}`}>
                MenuCraft
              </h1>
              <p className={`text-sm mt-1 transition-colors ${isScrolled ? 'text-[#6B5A4E]' : 'text-white/90 drop-shadow-md'}`}>
                Artisan Kitchen & Bar
              </p>
            </div>
            <div className={`px-3 py-1 text-xs font-semibold rounded-full border ${isScrolled ? 'border-[#8C3A21] text-[#8C3A21]' : 'border-white text-white drop-shadow-md bg-black/20'}`}>
              Demo App
            </div>
          </div>
        </header>
      </div>

      {/* Search Bar */}
      <div className="px-6 md:px-12 -mt-8 relative z-10 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E1D9] p-2 flex items-center gap-3 md:max-w-2xl md:mx-auto">
          <Search size={20} className="text-[#6B5A4E] ml-2" />
          <input 
            type="text" 
            placeholder="Search for dishes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[#3D2B1F] placeholder:text-[#A89F91] py-2"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-2 text-[#6B5A4E] hover:text-[#8C3A21]">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      {!searchQuery && (
        <div className="sticky top-[88px] z-20 bg-[#FDFBF7]/95 backdrop-blur-md py-4 px-6 md:px-12 border-b border-[#E8E1D9] overflow-x-auto hide-scrollbar mt-4">
          <div className="flex space-x-3 max-w-7xl mx-auto md:justify-center">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-[#8C3A21] text-white shadow-md scale-105'
                    : 'bg-white text-[#6B5A4E] border border-[#E8E1D9] hover:bg-[#F5EFE6]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Feed */}
      <main className="px-6 md:px-12 py-8 md:py-12 max-w-7xl mx-auto min-h-[50vh]">
        {searchQuery ? (
          <div className="mb-6">
            <h2 className="text-xl font-serif font-semibold text-[#3D2B1F]">
              Search Results ({filteredItems.length})
            </h2>
          </div>
        ) : (
          <h2 className="text-2xl font-serif font-semibold text-[#3D2B1F] mb-6">
            {activeCategory}
          </h2>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-[#6B5A4E]">
            <Utensils size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">No items found.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-[#8C3A21] font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <motion.div
            key={activeCategory + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#E8E1D9] flex flex-col group"
              >
                <div className="h-56 md:h-64 w-full relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.popular && (
                      <span className="bg-[#8C3A21] text-white text-xs font-bold px-2.5 py-1.5 rounded-md shadow-sm flex items-center gap-1 w-fit">
                        <Star size={12} className="fill-current" /> Popular
                      </span>
                    )}
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/95 backdrop-blur-sm text-[#3D2B1F] text-xs font-bold px-2.5 py-1.5 rounded-md shadow-sm w-fit"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-bold text-[#3D2B1F] leading-tight pr-4">
                      {item.name}
                    </h3>
                    <span className="text-lg font-bold text-[#8C3A21]">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[#6B5A4E] text-sm leading-relaxed mb-6 flex-1">
                    {item.description}
                  </p>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-3.5 rounded-xl bg-[#F5EFE6] text-[#8C3A21] font-semibold flex items-center justify-center gap-2 hover:bg-[#E8E1D9] transition-colors active:scale-[0.98]"
                  >
                    <Plus size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Location Footer */}
      <footer className="px-6 md:px-12 py-12 bg-[#3D2B1F] text-[#FDFBF7] mt-8 rounded-t-3xl md:rounded-3xl max-w-7xl mx-auto md:mb-12">
        <h3 className="text-2xl font-serif font-bold mb-8 text-center md:text-left">Visit Us</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <a
            href="https://maps.google.com/?q=123+Culinary+Ave,+Food+City"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 group bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <div className="bg-[#8C3A21] p-3.5 rounded-full group-hover:bg-[#A34A2E] transition-colors shrink-0">
              <MapPin size={24} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-lg">123 Culinary Ave</p>
              <p className="text-[#D4C5B9] text-sm mt-1">Food City, FC 90210</p>
              <p className="text-[#8C3A21] font-medium text-sm mt-3 flex items-center gap-1 group-hover:text-[#A34A2E] transition-colors">
                Open in Google Maps <ChevronRight size={14} />
              </p>
            </div>
          </a>
          <div className="flex items-start gap-4 bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="bg-[#5A4332] p-3.5 rounded-full shrink-0">
              <Clock size={24} className="text-[#D4C5B9]" />
            </div>
            <div>
              <p className="font-medium text-lg">Hours</p>
              <div className="mt-3 space-y-2">
                <p className="text-[#D4C5B9] text-sm flex justify-between w-48"><span>Mon-Thu:</span> <span>11am - 10pm</span></p>
                <p className="text-[#D4C5B9] text-sm flex justify-between w-48"><span>Fri-Sat:</span> <span>11am - 11pm</span></p>
                <p className="text-[#D4C5B9] text-sm flex justify-between w-48"><span>Sunday:</span> <span>10am - 9pm</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Info Corner */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[#D4C5B9]">
          <div className="text-sm text-center md:text-left">
            <p className="font-semibold text-white mb-1">Built with passion by Vicky</p>
            <p>I build automation tools, websites, and AI tools.</p>
          </div>
          <div className="flex flex-col items-center md:items-end text-sm space-y-1">
            <a href="https://vickyiitp.tech" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">vickyiitp.tech</a>
            <a href="mailto:vickyykumar14@gmail.com" className="hover:text-white transition-colors">vickyykumar14@gmail.com</a>
            <a href="tel:8102099678" className="hover:text-white transition-colors">8102099678</a>
          </div>
        </div>
      </footer>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartItemCount > 0 && !isCartOpen && (
          <motion.button
            key="cart-fab"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 w-[calc(100%-3rem)] md:w-auto md:min-w-[320px] max-w-sm bg-[#8C3A21] text-white py-4 px-6 rounded-2xl shadow-2xl flex items-center justify-between gap-6 z-40 active:scale-[0.98] transition-all hover:bg-[#A34A2E]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 bg-white text-[#8C3A21] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              </div>
              <span className="font-semibold text-lg">View Order</span>
            </div>
            <span className="font-bold text-xl">${cartTotal.toFixed(2)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Modal / Bottom Sheet */}
      <AnimatePresence>
        {isCartOpen && (
          <div key="cart-sheet" className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCheckoutSuccess && setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full md:w-[550px] bg-white rounded-t-3xl md:rounded-3xl flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden shadow-2xl"
            >
              {isProcessing ? (
                <div className="p-10 flex flex-col items-center justify-center text-center h-[500px]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 border-4 border-[#F5EFE6] border-t-[#8C3A21] rounded-full mb-6"
                  />
                  <h2 className="text-2xl font-serif font-bold text-[#3D2B1F] mb-3">Processing Order</h2>
                  <p className="text-[#6B5A4E] text-lg max-w-[280px]">{checkoutStep}</p>
                </div>
              ) : isCheckoutSuccess ? (
                <div className="p-10 flex flex-col items-center justify-center text-center h-[500px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 bg-[#F5EFE6] rounded-full flex items-center justify-center mb-6 text-[#8C3A21]"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h2 className="text-3xl font-serif font-bold text-[#3D2B1F] mb-3">Order Confirmed!</h2>
                  <p className="text-[#6B5A4E] text-lg">Your food is being prepared. We've sent a text to {customerPhone}.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-[#E8E1D9] flex items-center justify-between shrink-0 bg-white">
                    <h2 className="text-2xl font-serif font-bold text-[#3D2B1F]">Your Order</h2>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-2 bg-[#F5EFE6] rounded-full text-[#6B5A4E] hover:bg-[#E8E1D9] transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1 bg-[#FDFBF7]">
                    {cart.length === 0 ? (
                      <div className="text-center py-16 text-[#6B5A4E]">
                        <ShoppingBag size={64} className="mx-auto mb-6 opacity-20" />
                        <p className="text-xl font-medium">Your cart is empty.</p>
                        <p className="mt-2 text-sm">Add some delicious items to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="space-y-6">
                          {cart.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#E8E1D9]">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-xl"
                              />
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="font-semibold text-[#3D2B1F] leading-tight">{item.name}</h4>
                                  <p className="text-[#8C3A21] font-bold mt-1">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-3">
                                  <div className="flex items-center bg-[#F5EFE6] rounded-lg border border-[#E8E1D9]">
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="p-2 text-[#6B5A4E] hover:text-[#8C3A21] transition-colors"
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-[#3D2B1F]">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => addToCart(item)}
                                      className="p-2 text-[#6B5A4E] hover:text-[#8C3A21] transition-colors"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right font-bold text-[#3D2B1F] text-lg">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Customer Phone */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8E1D9]">
                          <label className="block text-sm font-semibold text-[#3D2B1F] mb-2">Phone Number <span className="text-red-500">*</span></label>
                          <input 
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full bg-[#FDFBF7] border border-[#E8E1D9] rounded-xl p-3 text-sm outline-none focus:border-[#8C3A21] transition-colors"
                          />
                        </div>

                        {/* Order Notes */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8E1D9]">
                          <label className="block text-sm font-semibold text-[#3D2B1F] mb-2">Special Instructions</label>
                          <textarea 
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            placeholder="Any allergies or special requests?"
                            className="w-full bg-[#FDFBF7] border border-[#E8E1D9] rounded-xl p-3 text-sm outline-none focus:border-[#8C3A21] transition-colors resize-none h-20"
                          />
                        </div>

                        {/* Tip Selector */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8E1D9]">
                          <label className="block text-sm font-semibold text-[#3D2B1F] mb-3">Add a Tip</label>
                          <div className="flex gap-3">
                            {TIPS.map((tip) => (
                              <button
                                key={tip}
                                onClick={() => setTipPercentage(tip)}
                                className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                                  tipPercentage === tip 
                                    ? 'bg-[#8C3A21] text-white' 
                                    : 'bg-[#F5EFE6] text-[#6B5A4E] hover:bg-[#E8E1D9]'
                                }`}
                              >
                                {tip * 100}%
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-white border-t border-[#E8E1D9] shrink-0 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-[#6B5A4E] text-sm">
                        <span>Subtotal</span>
                        <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[#6B5A4E] text-sm">
                        <span>Tax (8%)</span>
                        <span className="font-medium">${cartTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[#6B5A4E] text-sm">
                        <span>Tip ({(tipPercentage * 100).toFixed(0)}%)</span>
                        <span className="font-medium">${cartTip.toFixed(2)}</span>
                      </div>
                      <div className="pt-3 border-t border-[#E8E1D9] flex justify-between items-center">
                        <span className="text-xl font-bold text-[#3D2B1F]">Total</span>
                        <span className="text-2xl font-bold text-[#8C3A21]">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      disabled={cart.length === 0 || !customerPhone.trim()}
                      onClick={handleCheckout}
                      className="w-full py-4 rounded-2xl bg-[#8C3A21] text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform shadow-lg shadow-[#8C3A21]/30"
                    >
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
