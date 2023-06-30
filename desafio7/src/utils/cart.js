import cartModel from "../../models/carts.model";
import { cartService } from "../services/cart.service";

const cart = await cartService.getCart();

const cartId = localStorage.setItem('cartId', cart._id)