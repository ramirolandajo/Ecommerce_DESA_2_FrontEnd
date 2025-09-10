// Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CartDrawer from "./CartDrawer.jsx";
import { getQueryScore } from "../utils/getQueryScore.js";
import { logout } from "../store/user/userSlice.js";
import { clearCart, clearCartOnServer } from "../store/cart/cartSlice.js";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Tienda", href: "/shop" },
  { name: "Favoritos", href: "/favourites" },
];

const cx = (...c) => c.filter(Boolean).join(" ");

function SearchSuggestions({ isLoading, suggestions, onSelect }) {
  if (isLoading) {
    return (
      <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md bg-white shadow-lg flex justify-center p-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
      </div>
    );
  }
  if (suggestions.length === 0) return null;
  return (
    <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-md bg-white shadow-lg">
      {suggestions.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect(item.title)}
            className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 truncate"
          >
            {String(item.title || "").replace(/\n/g, " ")}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchTimeout = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const { items: products } = useSelector((s) => s.products);

  const totalItems = useSelector((s) =>
    s.cart.items.reduce((acc, i) => acc + i.quantity, 0)
  );

  const toggleCart = () => setCartOpen((prev) => !prev);

  const handleCartClick = () => {
    if (!isLoggedIn) {
      window.alert("Debes iniciar sesión para ver el carrito");
      navigate("/login");
      return;
    }
    toggleCart();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!value.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = value.toLowerCase();
    const pool = Array.isArray(products) ? products.filter((t) => t.stock > 0) : [];

    searchTimeout.current = setTimeout(() => {
      const filtered = pool
        .map((item) => ({ item, score: getQueryScore(item, q) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(({ item }) => item);

      setSuggestions(filtered);
      setIsLoading(false);
    }, 400);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      await dispatch(clearCartOnServer());
      dispatch(clearCart());
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const handleSelect = (title) => {
    navigate(`/shop?query=${encodeURIComponent(title)}`);
    setSuggestions([]);
    setQuery(title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setIsLoading(false);
    setSuggestions([]);
    navigate(`/shop?query=${encodeURIComponent(query)}`);
  };

  const handleClear = () => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setIsLoading(false);
    setQuery("");
    setSuggestions([]);
    navigate("/shop");
  };

  return (
    <>
      <Disclosure
        as="nav"
        className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      >
        {/* padding horizontal responsivo */}
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          {/* GRID: izq (logo+search) | centro (tabs) | der (iconos) */}
          <div className="grid h-16 w-full grid-cols-[1fr_auto_auto] items-center gap-4 sm:gap-6">
            {/* IZQUIERDA: logo + buscador */}
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              {/* Burger (mobile) */}
              <div className="sm:hidden">
                <DisclosureButton className="p-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 data-[state=open]:hidden">
                  <span className="sr-only">Abrir menú principal</span>
                  <Bars3Icon className="size-6" />
                </DisclosureButton>
                <DisclosureButton className="hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 data-[state=open]:block">
                  <span className="sr-only">Cerrar menú principal</span>
                  <XMarkIcon className="size-6" />
                </DisclosureButton>
              </div>

              {/* Logo / Marca */}
              <Link
                to="/"
                className="shrink-0 mr-4 md:mr-8 font-black text-2xl tracking-tight text-gray-900"
              >
                cyber
              </Link>

              {/* Search (solo md+) */}
              <form onSubmit={handleSubmit} className="hidden md:block flex-1 min-w-0">
                <div className="relative md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-2xl">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={handleChange}
                    placeholder="Buscar"
                    aria-label="Buscar"
                    className="w-full min-w-0 md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-2xl rounded-2xl border border-gray-200 bg-gray-100 pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      aria-label="Limpiar búsqueda"
                    >
                      <XMarkIcon className="size-4" />
                    </button>
                  )}
                  <SearchSuggestions
                    isLoading={isLoading}
                    suggestions={suggestions}
                    onSelect={handleSelect}
                  />
                </div>
              </form>
            </div>

            {/* CENTRO: tabs (sm+) */}
            <nav className="hidden sm:flex min-w-0 items-center justify-center gap-6 md:gap-10 lg:gap-14">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/"}
                  className={({ isActive }) =>
                    cx(
                      "relative px-1 py-2 font-semibold transition",
                      "text-sm md:text-base",
                      isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-900"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      {isActive && (
                        <span className="pointer-events-none absolute -bottom-1 left-1/2 h-0.5 w-10 md:w-12 lg:w-14 -translate-x-1/2 rounded bg-gray-900" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* DERECHA: iconos */}
            <div className="flex items-center justify-end gap-4 md:gap-6 lg:gap-8">
              <button
                className="relative p-2 rounded-full text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Carrito"
                onClick={handleCartClick}
              >
                <ShoppingCartIcon className="size-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </button>
                {isLoggedIn ? (
                  <Menu as="div" className="relative">
                    <MenuButton className="flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900">
                      {userInfo?.avatar ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={userInfo.avatar}
                          alt={userInfo?.name || "Usuario"}
                        />
                      ) : (
                        <span className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                          {userInfo?.name ? userInfo.name[0] : "U"}
                        </span>
                      )}
                    </MenuButton>
                    <MenuItems
                      transition
                      className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
                               data-[closed]:scale-95 data-[closed]:opacity-0
                               data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
                    >
                      {userInfo?.name && (
                        <MenuItem>
                          <span className="block px-4 py-2 text-sm text-gray-700">
                            {userInfo.name}
                          </span>
                        </MenuItem>
                      )}
                      <MenuItem>
                        <button
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleLogout}
                        >
                          Cerrar sesión
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/user-purchases"
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mis compras
                        </Link>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                ) : (
                  <Link to="/login" className="font-bold  tracking-tight text-gray-800">
                    Ingresa
                  </Link>
                )}
            </div>
          </div>
        </div>

        {/* MOBILE: navegación y buscador */}
        <DisclosurePanel className="sm:hidden border-t border-gray-200">
          <div className="px-2 py-3 space-y-1">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={NavLink}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  cx(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                {item.name}
              </DisclosureButton>
            ))}

            {/* Search en mobile */}
            <div className="px-1 pt-2 pb-3">
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={handleChange}
                    placeholder="Buscar"
                    aria-label="Buscar"
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 pl-10 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      aria-label="Limpiar búsqueda"
                    >
                      <XMarkIcon className="size-4" />
                    </button>
                  )}
                  <SearchSuggestions
                    isLoading={isLoading}
                    suggestions={suggestions}
                    onSelect={handleSelect}
                  />
                </div>
              </form>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/* Drawer del carrito */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
