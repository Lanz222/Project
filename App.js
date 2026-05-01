import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

import logo from "./images/Logo.jpg";

import coffee from "./images/icedcoffee.jpg";
import blackamericano from "./images/blackamericano.jpg";
import dalgona from "./images/dalgonacoffee.jpg";
import matcha from "./images/matchalatte.jpg";
import choco from "./images/hotchocolate.jpg";
import caramelmacchiato from "./images/caramelmacchiato.jpg";
import Cappuccino from "./images/coffee.jpg";
import icedchocoMocha from "./images/icedchocoMocha.jpg";
import BackG from "./images/BackG.jpg";

const PRODUCTS = [
 { id:1, name:"Iced Coffee", price:89, image:coffee },
 { id:2, name:"Black Americano", price:120, image:blackamericano },
 { id:3, name:"Dalgona Coffee", price:90, image:dalgona },
 { id:4, name:"Matcha Latte", price:95, image:matcha },
 { id:5, name:"Hot Chocolate", price:160, image:choco },
 { id:6, name:"Caramel Macchiato", price:125, image:caramelmacchiato },
 { id:7, name:"Cappuccino", price:89, image:Cappuccino },
 { id:8, name:"Iced Choco Mocha", price:110, image:icedchocoMocha },
];

const UPCOMING = [
  { id: 1, name: "Strawberry Shake", image: require("./images/strawberryshake.jpg") },
  { id: 2, name: "Mango Smoothie", image: require("./images/mango.jpg") },
  { id: 3, name: "Espresso", image: require("./images/espresso.jpg") },
  { id: 4, name: "Boba Supreme", image: require("./images/boba.jpg") },
];

export default function App(){

const [page,setPage]=useState('home'); 
const [cart,setCart]=useState([]);
const [cash,setCash]=useState('');
const [customerName,setCustomerName]=useState('');
const [receipts,setReceipts]=useState([]);
const [popup,setPopup]=useState(null);
const [hearts,setHearts]=useState({});
const [search,setSearch]=useState('');
const [paymentMethod, setPaymentMethod] = useState("Cash");

useEffect(()=>{
  const saved = sessionStorage.getItem('cashier-cart');
  const rec = sessionStorage.getItem('cashier-receipts');
  const savedHearts = sessionStorage.getItem('cashier-hearts');

  if(saved) setCart(JSON.parse(saved));
  if(rec) setReceipts(JSON.parse(rec));
  if(savedHearts) setHearts(JSON.parse(savedHearts));
},[]);

useEffect(()=>{
  sessionStorage.setItem('cashier-cart', JSON.stringify(cart));
},[cart]);

useEffect(()=>{
  sessionStorage.setItem('cashier-receipts', JSON.stringify(receipts));
},[receipts]);

const total = useMemo(()=> cart.reduce((a,b)=>a + b.price*b.qty,0),[cart]);
const payment = Number(cash || 0);
const change = payment-total;

const addToCart=(product)=>{
  setCart(prev=>{
    const exist = prev.find(i=>i.id===product.id);
    if(exist){
      return prev.map(i=>i.id===product.id ? {...i, qty:i.qty+1}:i);
    }
    return [...prev,{...product,qty:1}];
  })
}

const updateQty=(id,val)=>{
  setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(1,Number(val)||1)}:i));
}

const removeItem=(id)=> setCart(prev=>prev.filter(i=>i.id!==id));

const updateHeartsFromSales = (items) => {
  setHearts(prev => {
    const updated = { ...prev };
    items.forEach(item => {
      updated[item.id] = (updated[item.id] || 0) + item.qty;
    });
    sessionStorage.setItem("cashier-hearts", JSON.stringify(updated));
    return updated;
  });
};

const checkout = () => {
  if (cart.length === 0) {
    setPopup({ type: "error", message: "Cart is empty" });
    return;
  }

  if (paymentMethod === "Cash" && payment < total) {
    setPopup({ type: "error", message: "Insufficient payment" });
    return;
  }

  const data = {
    customer: customerName || "Walk-in Customer",
    items: cart,
    total,
    paid: paymentMethod === "Cash" ? payment : total,
    change: paymentMethod === "Cash" ? change : 0,
    method: paymentMethod,
    ref: "ORD-" + Date.now(),
    date: new Date().toLocaleString()
  };

  setReceipts(prev => [...prev, data]);

  updateHeartsFromSales(cart);

  setCart([]);
  setCash("");
  setCustomerName('');
  setPopup({ type: "success", message: "Payment Successful!" });
};
return (
<div className='app'>

<nav className='nav'>
  <div className="logoContainer">
    <img src={logo} alt="logo" className="logo" />
    <h1>Coffee Haven</h1>
  </div>

  <div>
    <button onClick={()=>setPage('home')}>Home</button>
    <button onClick={()=>setPage('checkout')}>Checkout</button>
  </div>
</nav>

{page==='home' && (
<>
  <div className="hero" style={{ backgroundImage: `url(${BackG})` }}>
    <div className="heroTitle">
      <img src={logo} alt="logo" className="heroLogo" />
      <h2>COFFEE HAVEN SHOP</h2>
    </div>
    <p>Premium handcrafted drinks</p>
  </div>

  <div className='grid'>
    <div className='box'>
      <h2>Available Drinks</h2>

      <input
        type="text"
        placeholder="Search drinks..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="searchBar"
      />

      <div className="drinkSplit">

        <div className="drinkBox">
          <h3>❄️ Cold Coffee</h3>
          {PRODUCTS.filter(p =>
            ["Iced Coffee","Dalgona Coffee","Matcha Latte","Iced Choco Mocha"].includes(p.name) &&
            p.name.toLowerCase().includes(search.toLowerCase())
          ).map(p => (
            <div key={p.id} className="productCard">
              <div className="imgWrapper">
                <img src={p.image} className="drinkImg" />
                <button className="heartBtn">❤️ {hearts[p.id] || 0}</button>
              </div>
              <h3>{p.name}</h3>
              <p>₱{p.price}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>

        <div className="drinkBox">
          <h3>🔥 Hot Coffee</h3>
          {PRODUCTS.filter(p =>
            ["Black Americano","Hot Chocolate","Caramel Macchiato","Cappuccino"].includes(p.name) &&
            p.name.toLowerCase().includes(search.toLowerCase())
          ).map(p => (
            <div key={p.id} className="productCard">
              <div className="imgWrapper">
                <img src={p.image} className="drinkImg" />
                <button className="heartBtn">❤️ {hearts[p.id] || 0}</button>
              </div>
              <h3>{p.name}</h3>
              <p>₱{p.price}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>

      </div>
    </div>

    <div className='box'>
      <h2>Coming Soon</h2>
      {UPCOMING.map(item => (
        <div key={item.id} className="comingCard">
          <img src={item.image} className="comingImg" />
          <h3>{item.name}</h3>
          <p>Coming Soon</p>
        </div>
      ))}
    </div>
  </div>
</>
)}

{page==='checkout' && (
<div className='box'>
<h2>Checkout</h2>


<div className="checkoutPanel">

<div className="checkoutGroup">
<label>Customer Name</label>
<input
type='text'
placeholder='Customer Name'
value={customerName}
onChange={(e)=>setCustomerName(e.target.value)}
className="searchBar"
/>
</div>

{cart.map(item => (
<div key={item.id} className='cartItem'>
<span>{item.name}</span>
<input type='number' value={item.qty} onChange={(e)=>updateQty(item.id,e.target.value)} />
<span>₱{item.price * item.qty}</span>
<button onClick={()=>removeItem(item.id)}>X</button>
</div>
))}


<div className="totalBox">
<span>Total</span>
<span>₱{total}</span>
</div>

<div className="checkoutGroup">
<label>Payment Method</label>

<select
value={paymentMethod}
onChange={(e)=>setPaymentMethod(e.target.value)}
className="searchBar"
>
<option>Cash</option>
<option>GCash</option>
<option>Card</option>
</select>
</div>

{paymentMethod === "Cash" && (
<>
<div className="checkoutGroup">
<label>Cash Amount</label>
<input
type='number'
placeholder='Cash Amount'
value={cash}
onChange={(e)=>setCash(e.target.value)}
className="searchBar"
/>
</div>

<div className="changeBox">
Change: ₱{change >= 0 ? change : 0}
</div>
</>
)}

<button className='checkoutBtn' onClick={checkout}>
Verify & Checkout
</button>

</div>


<div className="receiptContainer">
  <h2>Sales History</h2>

  {receipts.length === 0 && <p>No sales yet.</p>}

  {receipts.map((r, index) => (
    <div key={index} className="receipt">
      <h3>{r.ref}</h3>
      <p><strong>Customer:</strong> {r.customer}</p>
      <p><strong>Date:</strong> {r.date}</p>

      {r.items.map((item, i) => (
        <div key={i}>
          {item.name} x{item.qty} = ₱{item.price * item.qty}
        </div>
      ))}

      <hr />

      <p>Total: ₱{r.total}</p>
      <p>Paid: ₱{r.paid}</p>
      <p>Method: {r.method}</p>
      <p>Change: ₱{r.change}</p>
    </div>
  ))}
</div>

</div>
)}

{popup && (
  <div className="popupOverlay" onClick={() => setPopup(null)}>
    <div className="popupBox">
      <h2>{popup.type === "success" ? "Success" : "Error"}</h2>
      <p>{popup.message}</p>
      <button onClick={() => setPopup(null)}>OK</button>
    </div>
  </div>
)}

</div>
);
}