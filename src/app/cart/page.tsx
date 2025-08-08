
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, MessageSquareText, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import type { AppSettings } from '@/types';
import { useToast } from '@/hooks/use-toast';

const defaultSettings = {
    allowSignups: true,
    whatsappNumber: '',
    minOrderQuantity: 1, // A sensible default if fetch fails
}

// We fetch settings on the client to get the WhatsApp number
async function fetchSettings(): Promise<AppSettings> {
    try {
        const res = await fetch('/api/settings');
        if (!res.ok) {
          console.error("Failed to fetch settings, using defaults.");
          return defaultSettings;
        }
        const data = await res.json();
        // Merge with defaults to ensure all properties are present
        return { ...defaultSettings, ...data };
    } catch {
        console.error("Error fetching settings, using defaults.");
        return defaultSettings;
    }
}


export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, itemCount } = useCart();
  const [fullName, setFullName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      const fetchedSettings = await fetchSettings();
      setSettings(fetchedSettings);
    }
    loadSettings();
  }, []);

  const minOrderQuantity = settings?.minOrderQuantity || 1;
  const isDetailsComplete = fullName.trim() !== '' && shippingAddress.trim() !== '' && contactNumber.trim() !== '';
  const isMinOrderMet = itemCount >= minOrderQuantity;

  const handleWhatsAppOrder = () => {
    if (!isMinOrderMet) {
      toast({
        variant: "destructive",
        title: "Minimum Order Not Met",
        description: `You need at least ${minOrderQuantity} item(s) in your cart to place an order.`,
      });
      return;
    }

    if (!isDetailsComplete) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in your full name, shipping address, and contact number.",
      });
      return;
    }
    
    if (!settings || !settings.whatsappNumber) {
      toast({
        variant: "destructive",
        title: "Store Not Available",
        description: "Contact information is not available at the moment. Please try again later.",
      });
      return;
    }

    const adminPhoneNumber = settings.whatsappNumber;
    
    let message = 'Hello aTown, I would like to place an order for the following items:\n\n';
    
    cartItems.forEach(item => {
      message += `*${item.quantity}x* ${item.product.name} (@ INR ${item.product.price.toFixed(2)} each)\n`;
    });
    
    message += `\n----------------------\n`;
    message += `*Total Order Value: INR ${totalPrice.toFixed(2)}*\n\n`;
    message += `----------------------\n`;
    message += `*Delivery Details:*\n`;
    message += `*Full Name:* ${fullName}\n`;
    message += `*Shipping Address:* ${shippingAddress}\n`;
    message += `*Contact Number:* ${contactNumber}\n`;

    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-400px)]">
        <ShoppingCart className="mx-auto h-24 w-24 text-primary mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">It seems you haven't added any spirits to your cart yet. Explore our collection and find your new favorite.</p>
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg rounded-full px-8 py-6 font-bold shadow-lg hover:scale-105 transition-transform">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-headline text-3xl sm:text-4xl font-bold text-center mb-8 text-primary">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Cart Items */}
        <div className="lg:col-span-7 space-y-6">
          {cartItems.map(({ product, quantity }) => (
            <Card key={product.id} className="overflow-hidden shadow-lg border-primary/10 flex flex-col sm:flex-row max-w-sm mx-auto sm:max-w-full">
                <div className="relative w-full sm:w-32 md:w-40 flex-shrink-0 bg-card p-2 aspect-square">
                    <Image src={product.image} alt={product.name} fill className="object-contain" data-ai-hint={`${product.category} bottle`} />
                </div>
                
                <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                        <Link href={`/products/${product.id}`} className="font-headline text-lg font-bold text-primary hover:underline transition-colors pr-2">{product.name}</Link>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-7 w-7 flex-shrink-0" onClick={() => removeFromCart(product.id)}>
                            <Trash2 className="h-5 w-5" />
                        </Button>
                        </div>
                        <p className="text-md font-semibold text-primary/90">INR {product.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/20">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(product.id, quantity - 1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input type="number" value={quantity} readOnly className="h-8 w-12 text-center font-bold bg-transparent border-x-0 border-t-0 border-b-2 border-primary/50 focus-visible:ring-0" />
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(product.id, quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="font-bold text-lg">INR {(product.price * quantity).toFixed(2)}</p>
                    </div>
                </div>
            </Card>
          ))}
        </div>

        {/* Order Summary & Delivery Details */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="sticky top-24 space-y-8">
            <Card className="shadow-xl border-primary/20">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="shippingAddress">Shipping Address</Label>
                    <Textarea id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Enter your full address" required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input id="contactNumber" type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Enter your phone number" required />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-primary/20">
              <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({itemCount} {itemCount > 1 ? 'items' : 'item'})</span>
                  <span className="font-medium">INR {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-primary border-t pt-4 mt-2">
                  <span className="font-headline">Total</span>
                  <span>INR {totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  size="lg" 
                  className="w-full h-12 font-bold text-lg bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:scale-100 disabled:shadow-none" 
                  onClick={handleWhatsAppOrder}
                  disabled={!settings}
                  title={!isDetailsComplete ? "Please fill in all your details" : !isMinOrderMet ? `A minimum of ${minOrderQuantity} items is required` : "Place Order"}
                >
                  {settings ? <MessageSquareText className="mr-2 h-5 w-5"/> : <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Place Order via WhatsApp
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
