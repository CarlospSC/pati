import React, { useMemo, useState } from "react";

import { motion } from "framer-motion";

import {

  Search,

  Barcode,

  Users,

  Package,

  ClipboardList,

  Settings,

  FileText,

  Scissors,

  LogOut,

  Plus,

  Trash2,

  Tag,

  Percent,

  ChevronDown,

  Pencil,

} from "lucide-react";



import { DEMO_ITEMS } from "../data/demoItems";

import { currency } from "../utils/currency";



const DEFAULT_CUSTOMER = {

  id: 0,

  name: "Sin clientes",

  phone: "",

  due: 0,

  partial: null,

  tickets: [],

  purchases: [],

};



const BASE_CUSTOMERS = [

  {

    id: 1,

    name: "Maria Perez",

    phone: "55 1234 5678",

    due: 1200,

    partial: { total: 2200, paid: 1000, pending: 1200 },

    tickets: [

      {

        id: "T-1240",

        time: "02:00",

        date: "2025-08-12",

        total: 2200,

        paid: 1000,

        products: [

          { name: "Coca-Cola 600ml", qty: 1, total: 1200 },

          { name: "Pan blanco", qty: 1, total: 1000 },

        ],

      },

      {

        id: "T-1239",

        time: "05:00",

        date: "2025-08-12",

        total: 690,

        paid: 690,

        products: [{ name: "Pan blanco", qty: 1, total: 690 }],

      },

    ],

    purchases: [

      { id: "T-1240", item: "Coca-Cola 600ml", qty: 2, total: 2200 },

      { id: "T-1239", item: "Pan blanco", qty: 1, total: 690 },

    ],

  },

  {

    id: 2,

    name: "Juan Lopez",

    phone: "55 9876 5432",

    due: 0,

    partial: null,

    tickets: [

      {

        id: "T-1238",

        time: "13:10",

        date: "2025-08-11",

        total: 1960,

        paid: 1960,

        products: [{ name: "Agua mineral", qty: 4, total: 1960 }],

      },

      {

        id: "T-1231",

        time: "11:40",

        date: "2025-08-10",

        total: 1530,

        paid: 1530,

        products: [

          { name: "Botana mix", qty: 2, total: 1020 },

          { name: "Galletas", qty: 1, total: 510 },

        ],

      },

    ],

    purchases: [

      { id: "T-1238", item: "Agua mineral", qty: 4, total: 1960 },

      { id: "T-1231", item: "Botana mix", qty: 3, total: 1530 },

    ],

  },

  {

    id: 3,

    name: "Ana Gonzalez",

    phone: "55 2468 1357",

    due: 450,

    partial: { total: 450, paid: 0, pending: 450 },

    tickets: [

      {

        id: "T-1220",

        time: "09:05",

        date: "2025-08-09",

        total: 450,

        paid: 0,

        products: [

          { name: "Leche deslactosada", qty: 1, total: 225 },

          { name: "Yogur natural", qty: 1, total: 225 },

        ],

      },

    ],

    purchases: [{ id: "T-1220", item: "Leche deslactosada", qty: 2, total: 450 }],

  },

  {

    id: 4,

    name: "Carlos Diaz",

    phone: "55 1122 3344",

    due: 720,

    partial: null,

    tickets: [

      {

        id: "T-1217",

        time: "17:20",

        date: "2025-08-08",

        total: 480,

        paid: 480,

        products: [

          { name: "Huevos docena", qty: 1, total: 240 },

          { name: "Mantequilla", qty: 1, total: 240 },

        ],

      },

      {

        id: "T-1213",

        time: "15:15",

        date: "2025-08-07",

        total: 240,

        paid: 0,

        products: [

          { name: "Arroz 1kg", qty: 1, total: 120 },

          { name: "Frijol 1kg", qty: 1, total: 120 },

        ],

      },

      {

        id: "T-1180",

        time: "10:30",

        date: "2025-08-06",

        total: 480,

        paid: 0,

        products: [

          { name: "Aceite 1L", qty: 1, total: 320 },

          { name: "Sal 1kg", qty: 1, total: 160 },

        ],

      },

    ],

    purchases: [

      { id: "T-1217", item: "Huevos docena", qty: 2, total: 480 },

      { id: "T-1213", item: "Arroz 1kg", qty: 1, total: 240 },

      { id: "T-1180", item: "Aceite 1L", qty: 1, total: 480 },

    ],

  },

];



/**

 * Mockup moderno de punto de venta inspirado en la imagen.

 * - Diseño limpio, responsive, con jerarquía visual y espacios.

 * - Sin lógica real aún (solo UI). Posteriormente puedes conectar estado y API.

 */



const NAV = [

  { key: "ventas", label: "Ventas", icon: ClipboardList },

  { key: "clientes", label: "Clientes", icon: Users },

  { key: "productos", label: "Productos", icon: Package },

  { key: "inventario", label: "Inventario", icon: Barcode },

  { key: "historialVentas", label: "Historial de ventas", icon: FileText },

  { key: "facturas", label: "Facturas", icon: FileText },

  { key: "corte", label: "Corte", icon: Scissors },

];



const TICKET_ACCENTS = [

  { border: "border-emerald-500/40", glow: "shadow-[0_10px_25px_-15px_rgba(16,185,129,0.4)]" },

  { border: "border-cyan-500/40", glow: "shadow-[0_10px_25px_-15px_rgba(6,182,212,0.4)]" },

  { border: "border-amber-400/50", glow: "shadow-[0_10px_25px_-15px_rgba(251,191,36,0.35)]" },

  { border: "border-rose-500/40", glow: "shadow-[0_10px_25px_-15px_rgba(244,63,94,0.35)]" },

];



const PRODUCT_UNITS = [

  "Por unidad / pieza",

  "A granel (decimales)",

  "Como paquete (kit)",

];



const PRODUCT_DEPARTMENTS = [

  "Sin departamento",
  "Abarrotes",
  "Bebidas",
  "Lácteos",
  "Panadería",
  "Limpieza",
  "Cigarrillos",
];


const BASE_CATALOG = [

  {

    id: "7501059235021",

    name: "Coffee Mate 453g",

    description: "Coffee Mate 453g",

    unit: "Por unidad / pieza",

    department: "Abarrotes",

    cost: "45.00",

    price: "50.00",

    wholesale: "49.80",

    usesInventory: true,

    stock: "30.00",

    min: "5.00",

    max: "20",

    sold: "12",

  },

  {

    id: "7501812311389",

    name: "Coca-Cola 600ml",

    description: "Refresco 600ml",

    unit: "Por unidad / pieza",

    department: "Bebidas",

    cost: "12.00",

    price: "18.00",

    wholesale: "16.00",

    usesInventory: true,

    stock: "24",

    min: "6",

    max: "50",

    sold: "48",

  },

];



const SALES_HISTORY = [

  {

    id: "V-0001",

    date: "2025-08-12",

    time: "12:30",

    customer: "Maria Perez",

    total: 4880,

    paid: 0,

    pending: 4880,

    paymentMethod: "Efectivo",

    items: [

      { name: "Coca-Cola 600ml", qty: 2, price: 1100, lineTotal: 2200 },

      { name: "Pan blanco", qty: 1, price: 2680, lineTotal: 2680 },

    ],

  },

  {

    id: "V-0002",

    date: "2025-08-11",

    time: "10:10",

    customer: "Juan Lopez",

    total: 3490,

    paid: 3490,

    pending: 0,

    paymentMethod: "Efectivo",

    items: [{ name: "Agua mineral", qty: 4, price: 872.5, lineTotal: 3490 }],

  },

  {

    id: "V-0003",

    date: "2025-08-10",

    time: "09:05",

    customer: "Ana Gonzalez",

    total: 450,

    paid: 50,

    pending: 400,

    paymentMethod: "Efectivo",

    items: [

      { name: "Leche deslactosada", qty: 1, price: 225, lineTotal: 225 },

      { name: "Yogur natural", qty: 1, price: 225, lineTotal: 225 },

    ],

  },

];



export default function POSModerno() {

  const [active, setActive] = useState("ventas");

  const [query, setQuery] = useState("");

  const [cart, setCart] = useState(DEMO_ITEMS);

  const [discount, setDiscount] = useState({ type: "none", value: 0 });

  const [customers, setCustomers] = useState(BASE_CUSTOMERS);

  const [selectedCustomer, setSelectedCustomer] = useState(BASE_CUSTOMERS[0] || DEFAULT_CUSTOMER);

  const [payment, setPayment] = useState("");

  const [customerFocus, setCustomerFocus] = useState(BASE_CUSTOMERS[0] || DEFAULT_CUSTOMER);

  const [openTickets, setOpenTickets] = useState([]);

  const [associateCustomer, setAssociateCustomer] = useState(false);

  const [catalog, setCatalog] = useState(BASE_CATALOG);

  const [productMode, setProductMode] = useState("nuevo");

  const [selectedProductId, setSelectedProductId] = useState(BASE_CATALOG[0]?.id ?? "");

  const [inventoryDept, setInventoryDept] = useState("Todos");

  const [lowStockExpanded, setLowStockExpanded] = useState(true);

  const [manualPayments, setManualPayments] = useState({});

  const [manualPaymentInput, setManualPaymentInput] = useState("");

  const [manualPaymentsHistory, setManualPaymentsHistory] = useState({});
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteCustomer, setConfirmDeleteCustomer] = useState(false);
  const [salesHistory, setSalesHistory] = useState(SALES_HISTORY);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerDebt, setNewCustomerDebt] = useState("");
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editCustomerPhone, setEditCustomerPhone] = useState("");
  const [showTodaySales, setShowTodaySales] = useState(false);
  const [debtAlertAmount, setDebtAlertAmount] = useState(null);
  const [chargeConfirm, setChargeConfirm] = useState(null);
  const todaySales = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return salesHistory.filter((s) => s.date === todayStr);
  }, [salesHistory]);
  const todayTotal = useMemo(
    () => todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0),
    [todaySales]
  );
  const todayPendingClients = useMemo(
    () =>
      todaySales.reduce((sum, sale) => {
        const hasCustomer =
          sale.customer && sale.customer.toLowerCase() !== "venta sin cliente";
        return hasCustomer ? sum + (sale.pending || 0) : sum;
      }, 0),
    [todaySales]
  );
  const todayPaymentTotals = useMemo(() => {
    return todaySales.reduce(
      (acc, sale) => {
        const method = sale.paymentMethod === "Débito/Crédito" ? "card" : "cash";
        if (method === "card") acc.card += sale.total || 0;
        else acc.cash += sale.total || 0;
        return acc;
      },
      { cash: 0, card: 0 }
    );
  }, [todaySales]);
  const [productForm, setProductForm] = useState({

    code: "",

    name: "",

    description: "",

    unit: PRODUCT_UNITS[0],

    department: PRODUCT_DEPARTMENTS[0],

    cost: "",

    price: "",

    wholesale: "",

    usesInventory: true,

    stock: "",

    min: "",

  });

  const ticketSummary = useMemo(() => {

    const tickets = customerFocus.tickets || [];

    const totals = tickets.reduce(

      (acc, t) => {

        const paid = Math.min(t.paid, t.total);

        const pending = Math.max(0, t.total - t.paid);

        acc.paid += paid;

        acc.pending += pending;

        acc.total += t.total;

        return acc;

      },

      { paid: 0, pending: 0, total: 0 }

    );

    return totals;

  }, [customerFocus]);

  const hasTickets = (customerFocus.tickets || []).length > 0;

  const customerPending = hasTickets ? ticketSummary.pending : customerFocus.due;



  const totals = useMemo(() => {

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const discountAmt =

      discount.type === "percent"

        ? (subtotal * discount.value) / 100

        : discount.type === "amount"

        ? discount.value

        : 0;

    const total = Math.max(0, subtotal - discountAmt);

    return { subtotal, discountAmt, total };

  }, [cart, discount]);



  const paid = Number(payment) || 0;

  const due = Math.max(0, totals.total - paid);



  const inc = (idx) =>

    setCart((c) =>

      c.map((it, i) => {

        if (i !== idx) return it;

        if (it.qty >= it.stock) return it; // no incrementar si no hay existencia

        return { ...it, qty: it.qty + 1 };

      })

    );



  const dec = (idx) =>

    setCart((c) =>

      c

        .map((it, i) =>

          i === idx ? { ...it, qty: Math.max(1, it.qty - 1) } : it

        )

        .filter((it) => it.qty > 0)

    );



  const remove = (idx) => setCart((c) => c.filter((_, i) => i !== idx));



  const manualPaid = (manualPaymentsHistory[customerFocus.id] || []).reduce(

    (sum, entry) => sum + entry.amount,

    0

  );

  const customerPendingAdjusted = Math.max(0, customerPending - manualPaid);

  const ticketSummaryAdjusted = {

    ...ticketSummary,

    paid: ticketSummary.paid + manualPaid,

    pending: Math.max(0, ticketSummary.pending - manualPaid),

  };



  const adjustedDue = (customer) =>

    Math.max(0, (customer.due || 0) - (manualPayments[customer.id] || 0));



  const handleDeletePayment = (paymentId, clientId) => {

    setManualPaymentsHistory((prev) => {

      const list = (prev[clientId] || []).filter((entry) => entry.id !== paymentId);

      const updated = { ...prev, [clientId]: list };

      setManualPayments((mp) => ({

        ...mp,

        [clientId]: list.reduce((sum, entry) => sum + entry.amount, 0),

      }));

      return updated;

    });

    setConfirmDelete(null);

  };



  const handleDeleteCustomer = () => {

    setCustomers((prev) => {

      const filtered = prev.filter((c) => c.id !== customerFocus.id);

      const next = filtered[0] || DEFAULT_CUSTOMER;

      setCustomerFocus(next);

      setSelectedCustomer(next);

      return filtered.length > 0 ? filtered : [DEFAULT_CUSTOMER];

    });

    setConfirmDeleteCustomer(false);

  };



  const startEditCustomer = (customer) => {

    setEditCustomerId(customer.id);

    setEditCustomerName(customer.name);

    setEditCustomerPhone(customer.phone);

  };



  const cancelEditCustomer = () => {

    setEditCustomerId(null);

    setEditCustomerName("");

    setEditCustomerPhone("");

  };



  const saveEditCustomer = () => {
    if (!editCustomerId) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === editCustomerId ? { ...c, name: editCustomerName, phone: editCustomerPhone } : c
      )

    );

    setCustomerFocus((c) =>

      c.id === editCustomerId ? { ...c, name: editCustomerName, phone: editCustomerPhone } : c

    );

    setSelectedCustomer((c) =>
      c?.id === editCustomerId ? { ...c, name: editCustomerName, phone: editCustomerPhone } : c
    );
    cancelEditCustomer();
  };

  const resetNewCustomerForm = () => {
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerDebt("");
  };

  const handleAddCustomer = () => {
    const name = newCustomerName.trim();
    if (!name) return;
    const phone = newCustomerPhone.trim();
    const debtValue = Math.max(0, Number(newCustomerDebt) || 0);
    const newCustomer = {
      id: Date.now(),
      name,
      phone,
      due: debtValue,
      partial: debtValue > 0 ? { total: debtValue, paid: 0, pending: debtValue } : null,
      tickets: [],
      purchases: [],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    setCustomerFocus(newCustomer);
    setSelectedCustomer(newCustomer);
    resetNewCustomerForm();
    setShowAddCustomerForm(false);
  };

  const handleChargeClick = () => {
    const paidAmount = Math.max(0, Number(payment) || 0);
    const totalAmount = totals.total;
    const changeAmount = Math.max(0, paidAmount - totalAmount);
    const salePending = Math.max(0, totalAmount - paidAmount);
    const customerPending = associateCustomer ? adjustedDue(selectedCustomer) : 0;
    const totalAfterSale = associateCustomer ? customerPending + salePending : 0;
    setChargeConfirm({
      total: totalAmount,
      paid: paidAmount,
      change: changeAmount,
      salePending,
      totalAfterSale,
      showCustomerPending: associateCustomer,
    });
  };


  const handleCharge = () => {

    const paidAmount = Math.max(0, Number(payment) || 0);

    const pendingAmount = Math.max(0, totals.total - paidAmount);

    if (pendingAmount > 0 && !associateCustomer) {
      setDebtAlertAmount(pendingAmount);
      return;
    }

    const newId = `V-${String(salesHistory.length + 1).padStart(4, "0")}`;

    const now = new Date();

    const entry = {

      id: newId,

      date: now.toISOString().slice(0, 10),

      time: now.toTimeString().slice(0, 5),

      customer: associateCustomer ? selectedCustomer.name : "Venta sin cliente",

      total: totals.total,

      paid: paidAmount,

      pending: pendingAmount,

      paymentMethod,

      items: cart

        .filter((it) => it.qty > 0)

        .map((it) => ({

          name: it.name,

          qty: it.qty,

          price: it.price,

          lineTotal: it.price * it.qty,

        })),

    };

    setSalesHistory((prev) => [entry, ...prev]);

    setCart((c) =>

      c.map((it) => {

        const remaining = Math.max(0, it.stock - it.qty);

        return { ...it, stock: remaining, qty: 0 };

      })

    );

    setPayment("");

  };



  const change = Math.max(0, paid - totals.total);

  const filteredProducts = useMemo(() => {

    const q = query.trim().toLowerCase();

    if (!q) return [];

    return catalog.filter(

      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)

    );

  }, [query, catalog]);



  const addProductToCart = (product) => {

    const stockNum = Number(product.stock) || 0;

    setCart((prev) => {

      const idx = prev.findIndex((it) => it.code === product.id);

      if (idx >= 0) {

        return prev.map((it, i) =>

          i === idx ? { ...it, qty: Math.min(it.qty + 1, stockNum) } : it

        );

      }

      return [

        ...prev,

        {

          code: product.id,

          name: product.name,

          price: Number(product.price) || 0,

          qty: stockNum > 0 ? 1 : 0,

          stock: stockNum,

        },

      ];

    });

    setQuery("");

  };



  const handleSaveProduct = () => {

    const code = (productForm.code || "").trim();

    const name = (productForm.name || "").trim();

    if (!code || !name) return;

    const newProduct = {

      id: code,

      name,

      description: productForm.description || "",

      unit: productForm.unit,

      department: productForm.department,

      cost: productForm.cost || "0",

      price: productForm.price || "0",

      wholesale: productForm.wholesale || "0",

      usesInventory: productForm.usesInventory,

      stock: productForm.stock || "0",

      min: productForm.min || "0",

      max: productForm.max || "0",

      sold: "0",

    };

    setCatalog((prev) => {

      const idx = prev.findIndex((p) => p.id === code);

      if (idx >= 0) {

        const copy = [...prev];

        copy[idx] = { ...copy[idx], ...newProduct };

        return copy;

      }

      return [newProduct, ...prev];

    });

    setSelectedProductId(code);

    setProductMode("modificar");

  };



  return (

    <div className="min-h-screen bg-slate-950 text-slate-50 flex">

      {/* Sidebar */}

      <aside className="w-20 lg:w-64 bg-slate-900/60 border-r border-slate-800 flex flex-col">

        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-4 gap-2 border-b border-slate-800">

          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400" />

          <div className="hidden lg:block leading-tight">

            <div className="font-semibold">Abarrotes POS</div>

            <div className="text-xs text-slate-400">Punto de venta</div>

          </div>

        </div>



        <nav className="flex-1 p-2 lg:p-3 space-y-1">

          {NAV.map((n) => {

            const Icon = n.icon;

            const isActive = active === n.key;

            return (

              <button

                key={n.key}

                onClick={() => setActive(n.key)}

                className={

                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition " +

                  (isActive

                    ? "bg-slate-800 text-white shadow"

                    : "text-slate-300 hover:bg-slate-800/60")

                }

              >

                <Icon className="h-5 w-5 shrink-0" />

                <span className="hidden lg:block text-sm font-medium">

                  {n.label}

                </span>

              </button>

            );

          })}

        </nav>



        <div className="p-2 lg:p-3 border-t border-slate-800">

          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-slate-900">

            <div className="h-9 w-9 rounded-full bg-slate-700" />

            <div className="hidden lg:block">

              <div className="text-sm font-semibold">Administrador/a</div>

              <div className="text-xs text-slate-400">Caja 1</div>

            </div>

            <button className="ml-auto text-slate-300 hover:text-white">

              <LogOut className="h-5 w-5" />

            </button>

          </div>

        </div>

      </aside>



      {/* Main */}

      <main className="flex-1 flex flex-col">

        {/* Topbar */}

        <header className="h-16 bg-slate-950/40 backdrop-blur border-b border-slate-800 flex items-center gap-3 px-4">

          <div className="text-lg font-semibold tracking-tight">

            Venta de productos

          </div>

          <div className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-full">

            Ticket #{String(1).padStart(4, "0")}

          </div>



          <div className="ml-auto flex items-center gap-2">

            <button className="hidden md:flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800">

              <Users className="h-4 w-4" />

              Cliente

            </button>

            <button className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800">

              <FileText className="h-4 w-4" />

              Facturar

            </button>

            <button className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-900/40">

              <LogOut className="h-4 w-4" />

              Salir

            </button>

          </div>

        </header>



        {active === "clientes" ? (

          <div className="flex-1 grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 p-4">

            <section className="space-y-3">

              <div className="flex items-center justify-between px-1">
                <div className="text-sm text-slate-400">Listado de clientes</div>
                <button
                  onClick={() => setShowAddCustomerForm((v) => !v)}
                  className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-500/15 text-emerald-100 border border-emerald-800 hover:bg-emerald-500/25 transition"
                >
                  <Plus className="h-4 w-4" />
                  Agregar cliente
                </button>
              </div>

              {showAddCustomerForm && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg shadow-emerald-500/10">
                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-xs text-slate-300 space-y-1">
                      <span>Nombre</span>
                      <input
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        placeholder="Ej. Lucia Ramirez"
                        className="w-full h-11 bg-slate-950/40 border border-slate-800 rounded-xl px-3 text-sm text-slate-50 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </label>
                    <label className="text-xs text-slate-300 space-y-1">
                      <span>Número de teléfono</span>
                      <input
                        value={newCustomerPhone}
                        onChange={(e) => setNewCustomerPhone(e.target.value)}
                        placeholder="55 1234 5678"
                        className="w-full h-11 bg-slate-950/40 border border-slate-800 rounded-xl px-3 text-sm text-slate-50 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </label>
                    <label className="text-xs text-slate-300 space-y-1">
                      <span>Deuda inicial</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newCustomerDebt}
                        onChange={(e) => setNewCustomerDebt(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-11 bg-slate-950/40 border border-slate-800 rounded-xl px-3 text-sm text-slate-50 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        resetNewCustomerForm();
                        setShowAddCustomerForm(false);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-700 text-xs text-slate-200 hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddCustomer}
                      className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold"
                    >
                      Guardar cliente
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl divide-y divide-slate-800">

                {customers.map((c) => {

                  const isActiveCustomer = customerFocus.id === c.id;

                  const isEditing = editCustomerId === c.id;

                  return (

                    <button

                      key={c.id}

                      onClick={() => setCustomerFocus(c)}

                      className={

                        "w-full text-left px-4 py-3 flex items-center gap-3 transition " +

                        (isActiveCustomer

                          ? "bg-slate-800/60 text-slate-50"

                          : "hover:bg-slate-800/40 text-slate-200")

                      }

                    >

                      {!isEditing && (

                        <button

                          onClick={(e) => {

                            e.stopPropagation();

                            startEditCustomer(c);

                          }}

                          className="h-8 w-8 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 flex items-center justify-center"

                          title="Editar cliente"

                        >

                          <Pencil className="h-4 w-4" />

                        </button>

                      )}

                      <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold">

                        {c.name.slice(0, 2).toUpperCase()}

                      </div>

                      <div className="flex-1">

                        {isEditing ? (

                          <div className="space-y-1">

                            <input

                              value={editCustomerName}

                              onChange={(e) => setEditCustomerName(e.target.value)}

                              className="w-full h-8 bg-slate-900 border border-slate-700 rounded px-2 text-xs text-slate-50"

                            />

                            <input

                              value={editCustomerPhone}

                              onChange={(e) => setEditCustomerPhone(e.target.value)}

                              className="w-full h-8 bg-slate-900 border border-slate-700 rounded px-2 text-xs text-slate-50"

                            />

                            <div className="flex gap-2">

                              <button

                                onClick={(e) => {

                                  e.stopPropagation();

                                  saveEditCustomer();

                                }}

                                className="px-2 py-1 rounded bg-emerald-500 text-slate-900 text-xs font-semibold"

                              >

                                Guardar

                              </button>

                              <button

                                onClick={(e) => {

                                  e.stopPropagation();

                                  cancelEditCustomer();

                                }}

                                className="px-2 py-1 rounded border border-slate-700 text-xs text-slate-200"

                              >

                                Cancelar

                              </button>

                            </div>

                          </div>

                        ) : (

                          <>

                            <div className="font-semibold text-sm">{c.name}</div>

                            <div className="text-xs text-slate-400">{c.phone}</div>

                          </>

                        )}

                      </div>

                      <div className="text-right text-sm">

                        <div className="text-slate-400">Saldo</div>

                        <div

                          className={

                            adjustedDue(c) > 0 ? "text-amber-200 tabular-nums" : "text-emerald-200"

                          }

                        >

                          {adjustedDue(c) > 0 ? currency(adjustedDue(c)) : "Sin deuda"}

                        </div>

                      </div>

                    </button>

                  );

                })}

              </div>

            </section>



            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">

              <div className="flex flex-wrap gap-3 items-center">

                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-sm font-semibold">

                  {customerFocus.name.slice(0, 2).toUpperCase()}

                </div>

                <div>

                  <div className="text-lg font-semibold">{customerFocus.name}</div>

                  <div className="text-sm text-slate-400">{customerFocus.phone}</div>

                </div>

                <div className="flex flex-wrap gap-2 ml-auto">

                  <button

                    onClick={() => setShowPaymentHistory(false)}

                    className={

                      "h-10 px-3 rounded-lg border text-xs " +

                      (!showPaymentHistory

                        ? "border-emerald-700 bg-emerald-500/20 text-emerald-100"

                        : "border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800")

                    }

                  >

                    Tickets

                  </button>

                  <button

                    onClick={() => setShowPaymentHistory((v) => !v)}

                    className={

                      "h-10 px-3 rounded-lg border text-xs transition " +

                      (showPaymentHistory

                        ? "border-emerald-700 bg-emerald-500/20 text-emerald-100"

                        : "border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800")

                    }

                  >

                    Historial de pagos

                  </button>

                  <button

                    onClick={() => setConfirmDeleteCustomer(true)}

                    className="h-10 px-3 rounded-lg border text-xs transition border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-rose-700/30 hover:border-rose-800 hover:text-rose-100"

                  >

                    Eliminar cliente

                  </button>

                </div>

              </div>



              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">

                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3">

                  <div className="text-xs text-slate-400">Compras registradas</div>

                  <div className="text-lg font-semibold">{customerFocus.purchases.length}</div>

                </div>

                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3">

                  <div className="text-xs text-slate-400">Ultimo folio</div>

                  <div className="text-lg font-semibold">

                    {customerFocus.purchases[0]?.id ?? "-"}

                  </div>

                </div>

                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3">

                  <div className="text-xs text-slate-400">Pago parcial</div>

                  {customerFocus.partial ? (

                    <>

                      <div className="text-lg font-semibold tabular-nums">

                        Pagado {currency(customerFocus.partial.paid + manualPaid)} de{" "}

                        {currency(customerFocus.partial.total)}

                      </div>

                      <div className="text-xs text-slate-400">

                        Pendiente{" "}

                        {currency(Math.max(0, customerFocus.partial.pending - manualPaid))}

                      </div>

                    </>

                  ) : (

                    <>

                      <div className="text-lg font-semibold">Sin registro</div>

                      <div className="text-xs text-slate-400">Últimas compras pagadas completas</div>

                    </>

                  )}

                </div>

                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3">

                  <div className="text-xs text-slate-400">Total adeudado</div>

                  <div className="text-lg font-semibold tabular-nums">

                    {customerPendingAdjusted > 0 ? currency(customerPendingAdjusted) : "0"}

                  </div>

                </div>

              </div>



              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">

                <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden">

                  <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">

                    <div className="text-sm font-semibold text-slate-100">

                      {showPaymentHistory ? "Historial de pagos" : "Tickets por compra"}

                    </div>

                    <div className="text-xs text-slate-400">

                      {showPaymentHistory

                        ? (manualPaymentsHistory[customerFocus.id] || []).length + " registros"

                        : (customerFocus.tickets?.length ?? 0) + " registros"}

                    </div>

                  </div>



                  {showPaymentHistory ? (

                    <div className="divide-y divide-slate-800">

                      {(manualPaymentsHistory[customerFocus.id] || []).length === 0 && (

                        <div className="px-4 py-6 text-center text-slate-500 text-sm">

                          Sin pagos registrados.

                        </div>

                      )}

                      {(manualPaymentsHistory[customerFocus.id] || []).map((p) => (

                        <div

                          key={p.id}

                          className="px-4 py-3 grid grid-cols-[1fr_auto] items-center text-sm gap-3"

                        >

                          <div>

                            <div className="font-semibold tabular-nums text-slate-100">

                              {currency(p.amount)}

                            </div>

                            <div className="text-xs text-slate-500">

                              {p.date} · {p.time} · Manual

                            </div>

                          </div>

                          <button

                            onClick={() =>

                              setConfirmDelete({

                                id: p.id,

                                clientId: customerFocus.id,

                                amount: p.amount,

                                date: p.date,

                                time: p.time,

                              })

                            }

                            className="h-9 w-9 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-rose-200 flex items-center justify-center"

                            title="Eliminar pago"

                          >

                            <Trash2 className="h-4 w-4" />

                          </button>

                        </div>

                      ))}

                    </div>

                  ) : (

                    <div className="divide-y divide-slate-800">

                      {customerFocus.tickets?.map((t, idx) => {

                        const paid = Math.min(t.paid, t.total);

                        const pending = Math.max(0, t.total - t.paid);

                        const isOpen = openTickets.includes(t.id);

                        const accent = TICKET_ACCENTS[idx % TICKET_ACCENTS.length];

                        const toggle = () =>

                          setOpenTickets((prev) =>

                            prev.includes(t.id) ? prev.filter((i) => i !== t.id) : [...prev, t.id]

                          );

                        return (

                          <div

                            key={t.id}

                            className={

                              "px-4 py-4 space-y-3 text-sm rounded-xl border bg-slate-950/40 " +

                              accent.border +

                              " " +

                              accent.glow

                            }

                          >

                            <button

                              onClick={toggle}

                              className="w-full flex items-center gap-3 text-left hover:bg-slate-900/40 rounded-lg p-3 transition"

                            >

                              <div className="flex-1 flex items-start justify-between gap-3">

                                <div>

                                  <div className="text-xs text-slate-400">Ticket</div>

                                  <div className="text-base font-semibold text-slate-100">

                                    {t.id}

                                  </div>

                                  <div className="text-xs text-slate-500">

                                    Fecha {t.date} · Hora {t.time}

                                  </div>

                                </div>

                                <div className="text-right">

                                  <div className="text-xs text-slate-400">Total</div>

                                  <div className="text-lg font-semibold tabular-nums">

                                    {currency(t.total)}

                                  </div>

                                  <div className="flex gap-2 mt-2 text-xs">

                                    <span className="px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-900/50 text-emerald-200 tabular-nums">

                                    Pagado {currency(paid)}

                                    </span>

                                    <span className="px-2 py-1 rounded-full bg-amber-500/15 border border-amber-900/40 text-amber-200 tabular-nums">

                                    Pendiente {currency(pending)}

                                    </span>

                                  </div>

                                </div>

                              </div>

                              <ChevronDown

                                className={

                                  "h-5 w-5 text-slate-400 transition-transform " +

                                  (isOpen ? "rotate-180" : "")

                                }

                              />

                            </button>



                            {isOpen && (

                              <div className="bg-slate-950/30 border border-slate-800 rounded-lg p-3">

                                <div className="text-xs text-slate-400 mb-2">Productos</div>

                                <div className="space-y-1">

                                  {(t.products || []).map((p, idx) => {

                                    const unit = p.qty ? p.total / p.qty : p.total;

                                    return (

                                      <div

                                        key={idx}

                                        className="flex items-center justify-between text-xs text-slate-300"

                                      >

                                        <div className="flex flex-col">

                                          <span className="font-semibold text-slate-100">{p.name}</span>

                                          <span className="text-slate-500">

                                            x{p.qty} · {currency(unit)} c/u

                                          </span>

                                        </div>

                                        <div className="tabular-nums font-semibold">

                                          {currency(p.total)}

                                        </div>

                                      </div>

                                    );

                                  })}

                                </div>

                              </div>

                            )}

                          </div>

                        );

                      })}

                    </div>

                  )}

                </div>



                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-3">

                  <div className="text-sm font-semibold text-slate-100">Resumen deuda total</div>

                  <div className="space-y-2 text-sm">

                    <div className="flex items-center justify-between">

                      <span className="text-slate-400">Total compras</span>

                      <span className="tabular-nums text-slate-100">

                        {ticketSummaryAdjusted.total > 0

                          ? currency(ticketSummaryAdjusted.total)

                          : "Sin registros"}

                      </span>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="text-slate-400">Pagado</span>

                      <span className="tabular-nums text-emerald-200">

                        {currency(ticketSummaryAdjusted.paid)}

                      </span>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="text-slate-400">Pendiente</span>

                      <span className="tabular-nums text-amber-200">

                        {currency(ticketSummaryAdjusted.pending)}

                      </span>

                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">

                      <span className="text-slate-300 font-semibold">Saldo pendiente</span>

                      <span className="text-lg font-bold tabular-nums text-amber-200">

                        {currency(ticketSummaryAdjusted.pending)}

                      </span>

                    </div>

                    <div className="flex flex-col gap-2 pt-2">

                      <input

                        type="number"

                        value={manualPaymentInput}

                        onChange={(e) => setManualPaymentInput(e.target.value)}

                        placeholder="Registrar pago manual"

                        className="flex-1 h-12 bg-slate-950/40 border border-slate-800 rounded-xl px-3 text-sm text-slate-50 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"

                      />

                      <button

                        onClick={() => {

                          const amt = Math.max(0, Number(manualPaymentInput) || 0);

                          if (amt <= 0) return;

                          const entry = {

                            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),

                            amount: amt,

                            date: new Date().toISOString().slice(0, 10),

                            time: new Date().toTimeString().slice(0, 5),

                          };

                          setManualPayments((mp) => ({

                            ...mp,

                            [customerFocus.id]: (mp[customerFocus.id] || 0) + amt,

                          }));

                          setManualPaymentsHistory((hist) => ({

                            ...hist,

                            [customerFocus.id]: [...(hist[customerFocus.id] || []), entry],

                          }));

                          setManualPaymentInput("");

                        }}

                        className="w-full h-12 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-semibold px-4"

                      >

                        Registrar pago

                      </button>

                  </div>

                  </div>

                </div>

              </div>

            </section>

          </div>

        ) : active === "historialVentas" ? (

          <div className="flex-1 p-4">

            <SalesHistoryList sales={salesHistory} />

          </div>

        ) : active === "productos" ? (

          <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 p-4">

            <section className="space-y-4">

              <div className="flex items-center justify-between flex-wrap gap-3">

                <div className="flex gap-2">

                  <button

                    onClick={() => {

                      setProductMode("nuevo");

                      setProductForm({

                        code: "",

                        name: "",

                        description: "",

                        unit: PRODUCT_UNITS[0],

                        department: PRODUCT_DEPARTMENTS[0],

                        cost: "",

                        price: "",

                        wholesale: "",

                        usesInventory: true,

                        stock: "",

                        min: "",

                      });

                    }}

                    className={

                      "px-3 py-2 rounded-lg border text-sm " +

                      (productMode === "nuevo"

                        ? "bg-emerald-500/20 border-emerald-900/60 text-emerald-100"

                        : "bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-800")

                    }

                  >

                    Nuevo producto

                  </button>

                  <button

                    onClick={() => {

                      setProductMode("modificar");

                      if (catalog.length > 0) {

                        const p = catalog.find((pr) => pr.id === selectedProductId) || catalog[0];

                        setSelectedProductId(p.id);

                        setProductForm({

                          code: p.id,

                          name: p.name,

                          description: p.description,

                          unit: p.unit,

                          department: p.department,

                          cost: p.cost,

                          price: p.price,

                          wholesale: p.wholesale,

                          usesInventory: p.usesInventory,

                          stock: p.stock,

                          min: p.min,

                        });

                      }

                    }}

                    className={

                      "px-3 py-2 rounded-lg border text-sm " +

                      (productMode === "modificar"

                        ? "bg-cyan-500/20 border-cyan-900/60 text-cyan-100"

                        : "bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-800")

                    }

                  >

                    Modificar producto

                  </button>

                </div>

                <div className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">

                  {productMode === "nuevo" ? "Nuevo producto" : "Modificar producto"}

                </div>

              </div>



              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <Field

                    label={productMode === "modificar" ? "Nuevo código" : "Código de barras"}

                    value={productForm.code}

                    onChange={(e) => setProductForm((f) => ({ ...f, code: e.target.value }))}

                  />

                  {productMode === "modificar" ? (

                    <SelectField

                      label="Selecciona producto a editar"

                      value={selectedProductId}

                      options={catalog.map((p) => ({

                        value: p.id,

                        label: `${p.id} · ${p.name}`,

                      }))}

                      onChange={(e) => {

                        const id = e.target.value;

                        setSelectedProductId(id);

                        const p = catalog.find((pr) => pr.id === id);

                        if (p) {

                          setProductForm({

                            code: p.id,

                            name: p.name,

                            description: p.description,

                            unit: p.unit,

                            department: p.department,

                            cost: p.cost,

                            price: p.price,

                            wholesale: p.wholesale,

                            usesInventory: p.usesInventory,

                            stock: p.stock,

                            min: p.min,

                          });

                        }

                      }}

                    />

                  ) : (

                    <Field

                      label="Nombre"

                      value={productForm.name}

                      onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}

                    />

                  )}

                </div>



                <Field

                  label="Descripción"

                  value={productForm.description}

                  onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}

                />



                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  <SelectField

                    label="Se vende"

                    value={productForm.unit}

                    options={PRODUCT_UNITS}

                    onChange={(e) => setProductForm((f) => ({ ...f, unit: e.target.value }))}

                  />

                  <SelectField

                    label="Departamento"

                    value={productForm.department}

                    options={PRODUCT_DEPARTMENTS}

                    onChange={(e) => setProductForm((f) => ({ ...f, department: e.target.value }))}

                  />

                  <div className="flex items-end justify-end">

                    <label className="inline-flex items-center gap-2 text-xs text-slate-300">

                      <input

                        type="checkbox"

                        checked={productForm.usesInventory}

                        onChange={(e) =>

                          setProductForm((f) => ({ ...f, usesInventory: e.target.checked }))

                        }

                        className="h-4 w-4 rounded border-slate-700 bg-slate-900"

                      />

                      Este producto usa inventario

                    </label>

                  </div>

                </div>



                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  <MoneyField

                    label="Precio costo"

                    value={productForm.cost}

                    onChange={(e) => setProductForm((f) => ({ ...f, cost: e.target.value }))}

                  />

                  <MoneyField

                    label="Precio venta"

                    value={productForm.price}

                    onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}

                  />

                  <MoneyField

                    label="Precio mayoreo"

                    value={productForm.wholesale}

                    onChange={(e) => setProductForm((f) => ({ ...f, wholesale: e.target.value }))}

                  />

                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <Field

                    label="Stock actual"

                    value={productForm.stock}

                    onChange={(e) => setProductForm((f) => ({ ...f, stock: e.target.value }))}

                  />

                  <Field

                    label="Mínimo en inventario"

                    value={productForm.min}

                    onChange={(e) => setProductForm((f) => ({ ...f, min: e.target.value }))}

                  />

                </div>



                <div className="flex flex-wrap gap-3 justify-end">

                  <button className="px-4 py-2 rounded-xl border border-slate-700 text-sm text-slate-200 hover:bg-slate-800">

                    Cancelar

                  </button>

                  <button

                    onClick={handleSaveProduct}

                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20"

                  >

                    Guardar producto

                  </button>

                </div>

              </div>

            </section>



            <aside className="space-y-3">

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">

                <div className="text-sm font-semibold">Estado de inventario</div>

                <div className="text-xs text-slate-400">

                  Usa este panel para registrar precio, costo y existencias.

                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">

                  <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2">

                    <div className="text-xs text-slate-400">Costo</div>

                    <div className="font-semibold tabular-nums">

                      {productForm.cost ? currency(Number(productForm.cost) || 0) : "$0.00"}

                    </div>

                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2">

                    <div className="text-xs text-slate-400">Venta</div>

                    <div className="font-semibold tabular-nums">

                      {productForm.price ? currency(Number(productForm.price) || 0) : "$0.00"}

                    </div>

                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2">

                    <div className="text-xs text-slate-400">Mayoreo</div>

                    <div className="font-semibold tabular-nums">

                      {productForm.wholesale ? currency(Number(productForm.wholesale) || 0) : "$0.00"}

                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        ) : active === "inventario" ? (

          <div className="flex-1 grid grid-cols-1 gap-4 p-4">

            <div className="flex flex-wrap gap-3 items-center justify-between">

              <div>

                <div className="text-lg font-semibold">Reporte de inventario</div>

                <div className="text-sm text-slate-400">

                  Costo, precios y existencias por producto

                </div>

              </div>

              <div className="flex gap-2">

                <select

                  value={inventoryDept}

                  onChange={(e) => setInventoryDept(e.target.value)}

                  className="h-10 bg-slate-900 border border-slate-800 rounded-xl px-3 text-sm text-slate-50 outline-none"

                >

                  {["Todos", ...PRODUCT_DEPARTMENTS].map((d) => (

                    <option key={d}>{d}</option>

                  ))}

                </select>

                <button className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200">

                  Exportar

                </button>

              </div>

            </div>



            {(() => {

              const parse = (v) => Number(v) || 0;

              const rows = catalog.filter(

                (p) => inventoryDept === "Todos" || p.department === inventoryDept

              );

              const totals = rows.reduce(

                (acc, p) => {

                  acc.cost += parse(p.cost) * parse(p.stock || 0);

                  acc.count += 1;

                  acc.sold += parse(p.sold);

                  return acc;

                },

                { cost: 0, count: 0, sold: 0 }

              );

              return (

                <>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">

                      <div className="text-xs text-slate-400">Costo del inventario</div>

                      <div className="text-2xl font-bold tabular-nums">{currency(totals.cost)}</div>

                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">

                      <div className="text-xs text-slate-400">Productos en inventario</div>

                      <div className="text-2xl font-bold">{totals.count}</div>

                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">

                      <div className="text-xs text-slate-400">Unidades vendidas</div>

                      <div className="text-2xl font-bold tabular-nums">{totals.sold}</div>

                    </div>

                  </div>



                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">

                    <div className="grid grid-cols-[150px_1fr_110px_110px_90px_90px_90px_90px] text-xs uppercase tracking-wide text-slate-400 bg-slate-950/40 border-b border-slate-800 px-3 py-2">

                      <div>Código</div>

                      <div>Producto</div>

                      <div className="text-right">Costo</div>

                      <div className="text-right">Precio</div>

                      <div className="text-right">Stock</div>

                      <div className="text-right">Vendido</div>

                      <div className="text-right">Mínimo</div>

                      <div className="text-right">Máximo</div>

                    </div>

                    <div className="divide-y divide-slate-800">

                      {rows.map((p) => (

                        <div

                          key={p.id}

                          className="grid grid-cols-[150px_1fr_110px_110px_90px_90px_90px_90px] items-center px-3 py-2 text-sm"

                        >

                          <div className="font-mono text-xs text-slate-400">{p.id}</div>

                          <div>

                            <div className="font-semibold">{p.name}</div>

                            <div className="text-xs text-slate-400">{p.department}</div>

                          </div>

                          <div className="text-right tabular-nums">{currency(parse(p.cost))}</div>

                          <div className="text-right tabular-nums">{currency(parse(p.price))}</div>

                          <div className="text-right tabular-nums">{parse(p.stock)}</div>

                          <div className="text-right tabular-nums text-slate-300">{parse(p.sold)}</div>

                          <div className="text-right tabular-nums text-slate-300">{parse(p.min)}</div>

                          <div className="text-right tabular-nums text-slate-300">{parse(p.max)}</div>

                        </div>

                      ))}

                      {rows.length === 0 && (

                        <div className="px-4 py-6 text-center text-slate-400 text-sm">

                          No hay productos para este filtro.

                        </div>

                      )}

                    </div>

                  </div>



                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">

                    <button

                      onClick={() => setLowStockExpanded((v) => !v)}

                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-900 transition"

                    >

                      <div>

                        <div className="text-sm font-semibold text-slate-100">

                          Productos bajos en inventario

                        </div>

                        <div className="text-xs text-slate-400">

                          Listado de productos por debajo del mínimo

                        </div>

                      </div>

                      <ChevronDown

                        className={

                          "h-5 w-5 text-slate-400 transition-transform " +

                          (lowStockExpanded ? "rotate-180" : "")

                        }

                      />

                    </button>



                    {lowStockExpanded && (

                      <div className="border-t border-slate-800">

                        <div className="grid grid-cols-[150px_1fr_110px_90px_90px_90px] text-xs uppercase tracking-wide text-slate-400 bg-slate-950/40 border-b border-slate-800 px-3 py-2">

                          <div>Código</div>

                          <div>Producto</div>

                          <div className="text-right">Precio</div>

                          <div className="text-right">Stock</div>

                          <div className="text-right">Mínimo</div>

                          <div className="text-right">Departamento</div>

                        </div>

                        <div className="divide-y divide-slate-800">

                          {rows

                            .filter((p) => (Number(p.stock) || 0) < (Number(p.min) || 0))

                            .map((p) => (

                              <div

                                key={p.id}

                                className="grid grid-cols-[150px_1fr_110px_90px_90px_90px] items-center px-3 py-2 text-sm"

                              >

                                <div className="font-mono text-xs text-slate-400">{p.id}</div>

                                <div className="font-semibold">{p.name}</div>

                                <div className="text-right tabular-nums">

                                  {currency(Number(p.price) || 0)}

                                </div>

                                <div className="text-right tabular-nums text-amber-200">

                                  {Number(p.stock) || 0}

                                </div>

                                <div className="text-right tabular-nums text-slate-300">

                                  {Number(p.min) || 0}

                                </div>

                                <div className="text-right text-xs text-slate-400">

                                  {p.department}

                                </div>

                              </div>

                            ))}

                          {rows.filter((p) => (Number(p.stock) || 0) < (Number(p.min) || 0)).length ===

                            0 && (

                            <div className="px-4 py-6 text-center text-slate-400 text-sm">

                              No hay productos por debajo del mínimo.

                            </div>

                          )}

                        </div>

                      </div>

                    )}

                  </div>

                </>

              );

            })()}

          </div>

        ) : (

          <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 p-4">

            {/* Left side: search + table */}

            <section className="space-y-4">

              {/* Search / input row */}

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">

                <div className="relative">

                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                  <input

                    value={query}

                    onChange={(e) => setQuery(e.target.value)}

                    placeholder="Escanea o escribe codigo / nombre del producto"

                    className="w-full h-12 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-28 text-sm outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"

                  />

                  {query.trim() && filteredProducts.length > 0 && (

                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-10 max-h-64 overflow-auto">

                      {filteredProducts.slice(0, 6).map((p) => (

                        <button

                          key={p.id}

                          onMouseDown={(e) => e.preventDefault()}

                          onClick={() => addProductToCart(p)}

                          className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-3"

                        >

                          <div className="font-mono text-xs text-slate-400">{p.id}</div>

                          <div className="flex-1">

                            <div className="text-sm font-semibold text-slate-100">{p.name}</div>

                            <div className="text-xs text-slate-500">{p.department}</div>

                          </div>

                          <div className="text-right text-xs text-slate-300">

                            Stock {Number(p.stock) || 0}

                          </div>

                        </button>

                      ))}

                    </div>

                  )}

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">

                    <button

                      onClick={() => {

                        if (filteredProducts[0]) addProductToCart(filteredProducts[0]);

                      }}

                      className="h-9 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs flex items-center gap-2"

                    >

                      <Barcode className="h-4 w-4" />

                      Buscar

                    </button>

                    <button className="h-9 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 text-xs flex items-center gap-2 border border-emerald-900/50">

                      <Plus className="h-4 w-4" />

                      Agregar

                    </button>

                  </div>

                </div>


              </div>



              {/* Table */}

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">

                <div className="grid grid-cols-[160px_1fr_120px_140px_120px_120px_44px] text-xs uppercase tracking-wide text-slate-400 bg-slate-950/40 border-b border-slate-800 px-3 py-2">

                  <div>Codigo</div>

                <div>Articulo</div>

                  <div className="text-right">Precio</div>

                  <div className="text-center">Cantidad</div>

                  <div className="text-right">Importe</div>

                  <div className="text-right">Existencia</div>

                  <div />

                </div>



                <div className="divide-y divide-slate-800">

                  {cart.length === 0 && (

                    <div className="p-8 text-center text-slate-400">

                      No hay productos en la venta actual.

                    </div>

                  )}



                  {cart.map((it, idx) => (

                    <motion.div

                      key={it.code}

                      layout

                      initial={{ opacity: 0, y: 6 }}

                      animate={{ opacity: 1, y: 0 }}

                      className="grid grid-cols-[160px_1fr_120px_140px_120px_120px_44px] items-center px-3 py-2.5 text-sm"

                    >

                      <div className="font-mono text-xs text-slate-300">

                        {it.code}

                      </div>

                      <div className="font-medium">{it.name}</div>

                      <div className="text-right tabular-nums">

                        {currency(it.price)}

                      </div>



                      <div className="flex items-center justify-center gap-2">

                        <button

                          onClick={() => dec(idx)}

                          className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700"

                        >

                          -

                        </button>

                        <div className="w-10 text-center tabular-nums">

                          {it.qty}

                        </div>

                        <button

                          onClick={() => inc(idx)}

                          className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700"

                        >

                          +

                        </button>

                      </div>



                      <div className="text-right tabular-nums">

                        {currency(it.price * it.qty)}

                      </div>

                      <div className="text-right tabular-nums text-slate-300">

                        {Math.max(0, it.stock - it.qty)}

                      </div>

                      <button

                        onClick={() => remove(idx)}

                        className="h-8 w-8 rounded-lg hover:bg-rose-500/15 text-slate-300 hover:text-rose-200 flex items-center justify-center"

                        title="Quitar"

                      >

                        <Trash2 className="h-4 w-4" />

                      </button>

                    </motion.div>

                  ))}

                </div>

              </div>



              {/* Cliente para saldo pendiente */}

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">

                <div className="flex items-center justify-between">

                  <div className="text-sm font-semibold text-slate-100">

                    Cliente para saldo pendiente

                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300">

                  <input

                    type="checkbox"

                    checked={associateCustomer}

                    onChange={(e) => setAssociateCustomer(e.target.checked)}

                    className="h-4 w-4 rounded border-slate-700 bg-slate-900"

                  />

                  Asociar cliente

                </label>

              </div>



              <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-3">

                  <div className="flex flex-col gap-1">

                    <label className="text-xs text-slate-400">Selecciona cliente</label>

                    <select

                      value={selectedCustomer?.id ?? ""}

                      onChange={(e) =>

                        setSelectedCustomer(

                          customers.find((c) => c.id === Number(e.target.value)) ||

                          customers[0] ||

                          DEFAULT_CUSTOMER

                        )

                      }

                      className="h-11 bg-slate-950/40 border border-slate-800 rounded-xl px-3 text-sm text-slate-50 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"

                    >

                      {customers.map((c) => (

                        <option key={c.id} value={c.id}>

                          {c.name} - {c.phone}

                        </option>

                      ))}

                    </select>

                  </div>



                  <div className="flex flex-col gap-1">

                    <label className="text-xs text-slate-400">Saldo pendiente</label>

                    <div className="h-11 flex items-center px-3 rounded-xl bg-slate-950/40 border border-slate-800 text-sm tabular-nums">

                      {associateCustomer ? (due > 0 ? currency(due) : "Pago completo") : "No aplica"}

                    </div>

                  </div>

                </div>



                <p className="text-xs text-slate-400">

                  Activa "Asociar cliente" y asegúrate de que exista saldo pendiente para registrar a {selectedCustomer.name}. Si no, la venta quedará sin cliente asociado.

                </p>

              </div>



            </section>



            {/* Right side: totals + payment */}

            <aside className="space-y-4">

              {/* Totals card */}

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">

                <div className="flex items-center justify-between">

                  <div className="text-sm text-slate-400">Resumen</div>

                  <div className="text-xs text-slate-500">Caja 1</div>

                </div>



                <div className="mt-3 space-y-2 text-sm">

                  <Row label="Subtotal" value={currency(totals.subtotal)} />

                  <Row

                    label={

                      discount.type === "percent"

                        ? `Descuento (${discount.value}%)`

                        : discount.type === "amount"

                        ? "Descuento"

                        : "Descuento"

                    }

                    value={`- ${currency(totals.discountAmt)}`}

                    muted

                  />

                  <div className="h-px bg-slate-800 my-2" />

                  <Row

                    label={<span className="text-base font-semibold">Total</span>}

                    value={

                      <span className="text-2xl font-bold tabular-nums">

                        {currency(totals.total)}

                      </span>

                    }

                  />

                  {due > 0 ? (

                    <Row

                      label="Saldo pendiente"

                      value={<span className="tabular-nums">{currency(due)}</span>}

                      muted

                    />

                  ) : (

                    <Row label="Pago" value="Completo" muted />

                  )}

                  <Row

                    label="Cliente asociado"

                    value={associateCustomer && due > 0 ? selectedCustomer.name : "Ninguno"}

                    muted

                  />

                </div>



                {/* Descuentos rápidos removidos */}

              </div>



              {/* Payment card */}

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">

                <div className="text-sm text-slate-400">Pago</div>



                <label className="text-xs text-slate-400">Metodo</label>

                <div className="grid grid-cols-2 gap-2">

                  <PayChip
                    label="Efectivo"
                    active={paymentMethod === "Efectivo"}
                    onClick={() => setPaymentMethod("Efectivo")}
                  />

                  <PayChip
                    label="Débito/Crédito"
                    active={paymentMethod === "Débito/Crédito"}
                    onClick={() => setPaymentMethod("Débito/Crédito")}
                  />

                </div>



              <label className="text-xs text-slate-400 mt-2">Recibido</label>

              <input

                value={payment}

                onChange={(e) => setPayment(e.target.value)}

                placeholder="0"

                className="w-full h-11 bg-slate-950/40 border border-slate-800 rounded-xl px-3 text-sm outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"

              />

              <div className="flex items-center justify-between text-base text-slate-200">

                <span className="font-semibold">Vuelto</span>

                <span className="tabular-nums font-bold text-emerald-200 text-lg">

                  {currency(change)}

                </span>

              </div>



                <div className="grid grid-cols-2 gap-2">

                  <button className="h-12 rounded-xl bg-slate-950/40 hover:bg-slate-900 border border-slate-800 text-sm">

                    Guardar pendiente

                  </button>

                  <button

                    onClick={handleChargeClick}

                    className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20"

                  >

                    Cobrar (F12)

                  </button>

                </div>



                <button className="w-full h-11 rounded-xl bg-slate-950/40 hover:bg-slate-900 border border-slate-800 text-sm">

                  Reimprimir ultimo ticket

                </button>

              </div>



              {/* Footer mini-actions */}

              <div className="grid grid-cols-2 gap-2">

                <button

                  onClick={() => setShowTodaySales(true)}

                  className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm"

                >

                  Ventas del dia

                </button>

                <button className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm">

                  Devoluciones

                </button>

              </div>

            </aside>

          </div>

        )}

      </main>



      {confirmDeleteCustomer && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-[320px] shadow-xl shadow-black/40 space-y-4">

            <div className="text-lg font-semibold text-slate-100">

              ¿Está seguro de eliminar cliente?

            </div>

            <div className="text-sm text-slate-400">

              {customerFocus.name} · {customerFocus.phone || "Sin teléfono"}

            </div>

            <div className="flex gap-3 justify-end">

              <button

                onClick={() => setConfirmDeleteCustomer(false)}

                className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:bg-slate-800"

              >

                Cancelar

              </button>

              <button

                onClick={handleDeleteCustomer}

                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-900 text-sm font-semibold"

              >

                Confirmar

              </button>

            </div>

          </div>

        </div>

      )}



      {debtAlertAmount !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 w-[360px] shadow-xl shadow-amber-500/20 space-y-4">
            <div className="text-lg font-semibold text-amber-100">Deuda sin cliente asociado</div>
            <div className="text-sm text-slate-200 leading-relaxed">
              La venta actual registraría una deuda de{" "}
              <span className="font-semibold text-amber-100">{currency(debtAlertAmount)}</span> y no
              se ha asociado un cliente. 
            </div>
            <div className="text-sm text-slate-200 leading-relaxed">
              Por favor vuelve y asocia un cliente para que la deuda quede registrada correctamente.
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setDebtAlertAmount(null)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}



      {chargeConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[55]">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[360px] shadow-xl shadow-black/40 space-y-4">
            <div className="text-lg font-semibold text-slate-100">Confirmar cobro</div>
            <div className="space-y-3 text-sm text-slate-200">
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Cobro a realizarse</span>
                  <span className="font-semibold tabular-nums">{currency(chargeConfirm.total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pago recibido</span>
                  <span className="font-semibold tabular-nums">{currency(chargeConfirm.paid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vuelto</span>
                  <span className="font-semibold tabular-nums text-emerald-200">
                    {currency(chargeConfirm.change)}
                  </span>
                </div>
                {chargeConfirm.showCustomerPending && (
                  <div className="flex items-center justify-between">
                    <span>Deuda de compra</span>
                    <span className="font-semibold tabular-nums text-amber-200">
                      {currency(chargeConfirm.salePending)}
                    </span>
                  </div>
                )}
              </div>
              {chargeConfirm.showCustomerPending && (
                <div className="flex items-center justify-between">
                  <span>Deuda total posterior a compra</span>
                  <span className="font-semibold tabular-nums text-amber-200">
                    {currency(chargeConfirm.totalAfterSale)}
                  </span>
                </div>
              )}
            </div>
            <div className="text-sm text-slate-100 font-semibold">¿Desea ingresar la venta?</div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setChargeConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-200 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setChargeConfirm(null);
                  handleCharge();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold"
              >
                Ingresar venta
              </button>
            </div>
          </div>
        </div>
      )}



      {confirmDelete && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-[320px] shadow-xl shadow-black/40 space-y-4">

            <div className="text-lg font-semibold text-slate-100">

              ¿Está seguro de eliminar este pago?

            </div>

            <div className="text-sm text-slate-400">

              Monto: <span className="text-slate-100 tabular-nums">{currency(confirmDelete.amount)}</span>

              <br />

              Fecha: {confirmDelete.date} · Hora: {confirmDelete.time}

            </div>

            <div className="flex gap-3 justify-end">

              <button

                onClick={() => setConfirmDelete(null)}

                className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:bg-slate-800"

              >

                Cancelar

              </button>

              <button

                onClick={() => handleDeletePayment(confirmDelete.id, confirmDelete.clientId)}

                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-semibold"

              >

                Continuar

              </button>

            </div>

          </div>

        </div>

      )}



      {showTodaySales && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-[720px] max-h-[80vh] shadow-xl shadow-black/40 space-y-4 overflow-hidden">

            <div className="flex items-center justify-between">

              <div>

                <div className="text-lg font-semibold text-slate-100">Ventas del día</div>

                <div className="text-xs text-slate-400">{todaySales.length} registros</div>

              </div>

              <button

                onClick={() => setShowTodaySales(false)}

                className="px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:bg-slate-800"

              >

                Cerrar

              </button>

            </div>



            <div className="text-sm text-slate-200 space-y-1">
              <div>
                Total vendido hoy: <span className="font-semibold">{currency(todayTotal)}</span>
              </div>
              <div>
                Pendiente por cobrar (clientes):{" "}
                <span className="font-semibold text-amber-200">
                  {currency(todayPendingClients)}
                </span>
              </div>
              <div className="flex gap-4">
                <span>
                  Efectivo:{" "}
                  <span className="font-semibold text-emerald-200">
                    {currency(todayPaymentTotals.cash)}
                  </span>
                </span>
                <span>
                  Débito/Crédito:{" "}
                  <span className="font-semibold text-cyan-200">
                    {currency(todayPaymentTotals.card)}
                  </span>
                </span>
              </div>
            </div>


            <div className="divide-y divide-slate-800 overflow-y-auto pr-2 space-y-3 sales-scroll max-h-80">

              {todaySales.length === 0 && (

                <div className="py-6 text-center text-slate-500 text-sm">

                  No hay ventas registradas hoy.

                </div>

              )}

              {todaySales.map((sale, idx) => {
                const accents = [
                  "border-emerald-900/60 bg-emerald-500/5",
                  "border-cyan-900/60 bg-cyan-500/5",
                  "border-amber-900/60 bg-amber-500/5",
                ];
                const accent = accents[idx % accents.length];
                const hasCustomer = sale.customer && sale.customer.toLowerCase() !== "venta sin cliente";
                return (
                  <div
                    key={sale.id}
                    className={
                      "pt-3 first:pt-0 rounded-xl border px-4 py-3 shadow-sm " +
                      accent +

                      " border-slate-800"

                    }

                  >

                    <div className="flex items-center justify-between text-sm">

                      <div>

                        <div className="font-semibold text-slate-100">

                          {sale.customer || "Venta sin cliente"}

                        </div>

                        <div className="text-xs text-slate-500">

                          {sale.date} · {sale.time}

                        </div>

                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-100 tabular-nums">
                          {currency(sale.total)}
                        </div>
                        {hasCustomer && (
                          <>
                            <div className="text-xs text-emerald-200 tabular-nums">
                              Pagado {currency(sale.paid)}
                            </div>
                            <div className="text-xs text-amber-200 tabular-nums">
                              Pendiente {currency(sale.pending)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-2">

                      <div className="text-xs text-slate-400">Productos</div>

                      {(sale.items || []).map((item, idxItem) => (

                        <div

                          key={idxItem}

                          className="grid grid-cols-[1fr_60px_90px] text-xs text-slate-200 items-center rounded-md px-2 py-1 hover:bg-slate-900/60"

                        >

                          <div className="text-slate-100">{item.name}</div>

                          <div className="tabular-nums text-slate-400 text-right">x{item.qty}</div>

                          <div className="text-right tabular-nums text-slate-300">

                            {item.price !== undefined ? currency(item.price) : "-"}

                          </div>

                        </div>

                      ))}

                      {(sale.items || []).length === 0 && (

                        <div className="text-xs text-slate-500">Sin detalle de productos.</div>

                      )}

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

function toISO(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function DateRangePopover({ month, start, end, hover, onHover, onSelect, onClose, onMonthChange }) {
  const baseMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);

  const renderMonth = (base) => {
    const year = base.getFullYear();
    const m = base.getMonth();
    const firstDay = new Date(year, m, 1);
    const startWeekDay = (firstDay.getDay() + 6) % 7; // Monday as first column
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startWeekDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));

    const isInPreviewRange = (date) => {
      const previewEnd = end || hover;
      if (!start || !previewEnd) return false;
      const startTime = start.getTime();
      const endTime = previewEnd.getTime();
      const [a, b] = startTime <= endTime ? [startTime, endTime] : [endTime, startTime];
      return date.getTime() >= a && date.getTime() <= b;
    };

    return (
      <div className="w-[220px]">
        <div className="text-center text-xs text-slate-300 mb-2 capitalize">
          {base.toLocaleString("es-ES", { month: "long", year: "numeric" })}
        </div>
        <div className="grid grid-cols-7 text-[11px] text-slate-500 mb-1 uppercase">
          {["lu", "ma", "mi", "ju", "vi", "sá", "do"].map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, idx) => {
            if (!cell) return <div key={`empty-${idx}`} />;
            const iso = toISO(cell);
            const isStart = start && toISO(start) === iso;
            const isEnd = end && toISO(end) === iso;
            const inRange = isInPreviewRange(cell);
            const isToday = toISO(new Date()) === iso;
            const baseClasses =
              "h-8 w-8 rounded-lg text-xs flex items-center justify-center cursor-pointer transition";
            const rangeClasses = inRange ? "bg-emerald-500/15 text-emerald-100" : "text-slate-200";
            const edgeClasses =
              isStart || isEnd
                ? "bg-emerald-500 text-slate-950 font-semibold"
                : rangeClasses;
            const todayRing = isToday ? "border border-emerald-800/60" : "border border-transparent";
            return (
              <button
                key={iso}
                onMouseEnter={() => onHover(cell)}
                onMouseLeave={() => onHover(null)}
                onClick={() => {
                  if (!start || (start && end)) {
                    onSelect({ start: cell, end: null });
                  } else {
                    if (cell.getTime() < start.getTime()) {
                      onSelect({ start: cell, end: start });
                    } else {
                      onSelect({ start, end: cell });
                    }
                  }
                }}
                className={`${baseClasses} ${edgeClasses} ${todayRing}`}
              >
                {cell.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-12 left-0 z-20 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between mb-2 text-xs text-slate-200">
        <div className="flex items-center gap-1">
          <button
            className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
            onClick={() =>
              onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
            title="Mes anterior"
          >
            ‹
          </button>
          <button
            className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
            onClick={() =>
              onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
            title="Mes siguiente"
          >
            ›
          </button>
        </div>
        <button
          className="h-8 px-3 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
      <div className="flex gap-3">
        {renderMonth(baseMonth)}
        {renderMonth(nextMonth)}
      </div>
    </div>
  );
}



function Row({ label, value, muted }) {

  return (

    <div className="flex items-center justify-between">

      <div className={muted ? "text-slate-400" : "text-slate-200"}>

        {label}

      </div>

      <div className={muted ? "text-slate-400" : "text-slate-50"}>

        {value}

      </div>

    </div>

  );

}



function PayChip({ label, active, onClick }) {

  return (

    <button

      onClick={onClick}

      className={

        "h-10 rounded-xl border text-sm transition " +

        (active

          ? "bg-cyan-500/15 border-cyan-900/60 text-cyan-200"

          : "bg-slate-950/40 border-slate-800 text-slate-200 hover:bg-slate-900")

      }

    >

      {label}

    </button>

  );

}



function Field({ label, value, onChange, type = "text" }) {

  return (

    <label className="text-xs text-slate-400 space-y-1 w-full">

      <span>{label}</span>

      <input

        type={type}

        value={value}

        onChange={onChange}

        className="w-full h-11 bg-slate-950/40 border border-slate-800 rounded-xl px-3 text-sm text-slate-50 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"

      />

    </label>

  );

}



function SelectField({ label, value, options, onChange }) {

  return (

    <label className="text-xs text-slate-400 space-y-1 w-full">

      <span>{label}</span>

      <select

        value={value}

        onChange={onChange}

        className="w-full h-11 bg-slate-950/40 border border-slate-800 rounded-xl px-3 text-sm text-slate-50 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"

      >

        {options.map((opt) => {

          const val = typeof opt === "string" ? opt : opt.value;

          const labelOpt = typeof opt === "string" ? opt : opt.label;

          return (

            <option key={val} value={val}>

              {labelOpt}

            </option>

          );

        })}

      </select>

    </label>

  );

}



function MoneyField(props) {

  return <Field {...props} type="number" />;

}



function SalesHistoryList({ sales }) {

  const [open, setOpen] = useState([]);
  const [openGroups, setOpenGroups] = useState([]);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [rangeOpen, setRangeOpen] = useState(false);
  const [rangeHover, setRangeHover] = useState(null);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [rangeMonth, setRangeMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });


  const toggle = (id) =>

    setOpen((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));



  const toggleGroup = (date) =>

    setOpenGroups((prev) =>

      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]

    );



  const filteredSales = sales.filter((s) => {
    if (filterFrom && s.date < filterFrom) return false;
    if (filterTo && s.date > filterTo) return false;
    return true;
  });


  const grouped = filteredSales.reduce((acc, sale) => {

    acc[sale.date] = acc[sale.date] ? [...acc[sale.date], sale] : [sale];

    return acc;

  }, {});



  const orderedDates = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));



  return (

    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl">

      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">

        <div className="text-sm font-semibold text-slate-100">Historial de ventas</div>

        <div className="text-xs text-slate-400">{sales.length} registros</div>

      </div>

      <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 relative">
          <span>Rango de fechas:</span>
          <button
            onClick={() => setRangeOpen((v) => !v)}
            className="h-10 min-w-[220px] bg-slate-950/40 border border-slate-800 rounded-lg px-3 text-left text-xs text-slate-100 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 hover:bg-slate-900 transition"
          >
            {filterFrom || filterTo ? (
              <span className="flex items-center gap-1">
                <span>{filterFrom || "—"}</span>
                <span className="text-slate-500">~</span>
                <span>{filterTo || "—"}</span>
              </span>
            ) : (
              <span className="text-slate-500">Selecciona rango</span>
            )}
          </button>
          {rangeOpen && (
            <DateRangePopover
              month={rangeMonth}
              start={rangeStart}
              end={rangeEnd}
              hover={rangeHover}
              onHover={setRangeHover}
              onSelect={(dates) => {
                setRangeStart(dates.start);
                setRangeEnd(dates.end);
                setFilterFrom(dates.start ? toISO(dates.start) : "");
                setFilterTo(dates.end ? toISO(dates.end) : "");
                if (dates.start && dates.end) setRangeOpen(false);
              }}
              onClose={() => setRangeOpen(false)}
              onMonthChange={setRangeMonth}
            />
          )}
        </div>
        {(filterFrom || filterTo) && (
          <button
            onClick={() => {
              setFilterFrom("");
              setFilterTo("");
              setRangeStart(null);
              setRangeEnd(null);
            }}
            className="text-xs text-emerald-200 hover:text-emerald-100 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>
      <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto pr-1 sales-scroll">

        {orderedDates.length === 0 && (

          <div className="px-4 py-6 text-center text-slate-500 text-sm">Sin ventas.</div>

        )}

        {orderedDates.map((date) => {

          const groupOpen = openGroups.includes(date);

          const groupSales = grouped[date] || [];

          return (

            <div key={date} className="text-sm">

              <button

                onClick={() => toggleGroup(date)}

                className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-slate-900/50"

              >

                <div className="font-semibold text-slate-100">Ventas del {date}</div>

                <ChevronDown

                  className={

                    "h-4 w-4 text-slate-400 transition-transform " + (groupOpen ? "rotate-180" : "")

                  }

                />

              </button>

              {groupOpen && (

                <div className="divide-y divide-slate-800">

                  {groupSales.map((s) => {

                    const isOpen = open.includes(s.id);

                    return (

                      <div key={s.id} className="px-4 py-3">

                        <div className="grid grid-cols-[100px_1fr_120px] items-center gap-3">

                          <div className="font-mono text-xs text-slate-400">{s.id}</div>

                          <div className="flex items-center gap-2">

                            <button

                              onClick={() => toggle(s.id)}

                              className="h-7 w-7 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-300 hover:bg-slate-800"

                              title={isOpen ? "Ocultar detalle" : "Ver detalle"}

                            >

                              <ChevronDown

                                className={

                                  "h-4 w-4 transition-transform " + (isOpen ? "rotate-180" : "")

                                }

                              />

                            </button>

                            <div>

                              <div className="font-semibold text-slate-100">

                                {s.customer || "Venta sin cliente"}

                              </div>

                              <div className="text-xs text-slate-500">

                                {s.date} · {s.time}

                              </div>

                            </div>

                          </div>

                          <div className="text-right space-y-1">

                            <div className="text-slate-100 font-semibold tabular-nums">

                              {currency(s.total)}

                            </div>

                            <div className="text-xs text-emerald-200 tabular-nums">

                              Pagado {currency(s.paid)}

                            </div>

                            <div className="text-xs text-amber-200 tabular-nums">

                              Pendiente {currency(s.pending)}

                            </div>

                          </div>

                        </div>

                        {isOpen && (

                          <div className="mt-2 ml-9 rounded-lg border border-slate-800 bg-slate-950/50 p-3 space-y-1">

                            <div className="text-xs text-slate-400">Productos</div>

                            {(s.items || []).length === 0 ? (

                              <div className="text-xs text-slate-500">Sin detalle de productos.</div>

                            ) : (

                              (s.items || []).map((item, idx) => (

                                <div

                                  key={idx}

                                  className="flex items-center justify-between text-xs text-slate-200"

                                >

                                  <span className="text-slate-100">{item.name}</span>

                                  <span className="tabular-nums text-slate-400">x{item.qty}</span>

                                </div>

                              ))

                            )}

                          </div>

                        )}

                      </div>

                    );

                  })}

                </div>

              )}

            </div>

          );

        })}

      </div>

    </div>

  );

}
