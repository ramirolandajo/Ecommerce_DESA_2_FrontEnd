# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Cart state management

Este proyecto incluye un slice de Redux (`cartSlice`) para manejar el carrito de compras.

### Estado inicial

```js
{
  items: [],
  totalQuantity: 0,
  totalAmount: 0
}
```

El estado se persiste en `localStorage` para mantener los datos entre recargas.

### Acciones principales

- `addItem({ id, title, price, quantity })`
- `removeItem(id)`
- `updateQuantity({ id, quantity })`
- `incrementItem(id)`
- `decrementItem(id)`
- `clearCart()`

### Ejemplo de uso en componentes

```jsx
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "../store/cartSlice";

function Product({ product }) {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(addItem(product))}>Agregar</button>
  );
}

function Cart() {
  const items = useSelector((s) => s.cart.items);
  return items.map((i) => (
    <div key={i.id}>
      {i.title}
      <button onClick={() => dispatch(removeItem(i.id))}>Quitar</button>
    </div>
  ));
}
```

Consulta `src/Components/GlassProductCard.jsx` y `src/Components/CartDrawer.jsx` para ejemplos completos de integración.

## Mercado Pago (modo de prueba)

Para habilitar los pagos en el entorno de desarrollo se utilizan las siguientes variables de entorno:

- `VITE_MP_PUBLIC_KEY`: *public key* de prueba utilizada en el frontend para inicializar el SDK de Mercado Pago.
- `MP_ACCESS_TOKEN`: *access token* de prueba que debe configurar el backend para crear las preferencias de pago.

Asegúrate de definirlas (por ejemplo en un archivo `.env`) antes de ejecutar la aplicación en modo de prueba.
