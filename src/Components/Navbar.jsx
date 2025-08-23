// Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import CartDrawer from "./CartDrawer.jsx";
import { tiles } from "../data/Products";

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
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
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
            onClick={() => onSelect(item.id)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            <img
              src={item.media?.src}
              alt={item.title}
              className="h-8 w-8 rounded object-cover"
            />
            <span>{String(item.title || "").replace(/\n/g, " ")}</span>
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

  const toggleCart = () => setCartOpen((prev) => !prev);

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
    const pool = Array.isArray(tiles) ? tiles : [];

    searchTimeout.current = setTimeout(() => {
      const filtered = pool
        .filter(
          (item) =>
            item?.title?.toLowerCase().includes(q) ||
            item?.category?.toLowerCase().includes(q)
        )
        .slice(0, 5);

      setSuggestions(filtered);
      setIsLoading(false);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const handleSelect = (id) => {
    navigate(`/producto/${id}`);
    setSuggestions([]);
    setQuery("");
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
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="size-6" />
                </DisclosureButton>
                <DisclosureButton className="hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 data-[state=open]:block">
                  <span className="sr-only">Close main menu</span>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(`/shop?query=${encodeURIComponent(query)}`);
                }}
                className="hidden md:block flex-1 min-w-0"
              >
                <div
                  className="relative md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-2xl"
                >
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search"
                    className="
                      w-full min-w-0
                      md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-2xl
                      rounded-2xl border border-gray-200 bg-gray-100
                      pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-gray-900
                    "
                  />
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
                className="p-2 rounded-full text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Cart"
                onClick={toggleCart}
              >
                <ShoppingCartIcon className="size-6" />
              </button>

              {/* Avatar / Menú usuario */}
              <Menu as="div" className="relative">
                <MenuButton className="flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                  />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
                             data-[closed]:scale-95 data-[closed]:opacity-0
                             data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(`/shop?query=${encodeURIComponent(query)}`);
                }}
              >
                <div className="relative">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search"
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 pl-10 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900"
                  />
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
