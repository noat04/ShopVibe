import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { products } from "../../page/Products/Products";
import { useDispatch } from "react-redux";
import { changeQuanlity } from "../../stores/cartData";

const CartItem = (props) => {
    const { productId, quanlity } = props.data;
    // Sửa thành:
    const [productDetail, setProductDetail] = useState(null);

    const dispatch = useDispatch();
    useEffect(() => {
        const findDetail = products.filter(product => product.productId == productId)[0];
        setProductDetail(findDetail);
    }, [productId])
    const handleMinusQuanlity = () => {
        dispatch(changeQuanlity({
            productId: productId,
            quanlity: quanlity - 1
        }))
    }
    const handlePlusQuanlity = () => {
        dispatch(changeQuanlity({
            productId: productId,
            quanlity: quanlity + 1
        }))
    }
    return (
        <div className="flex justify-content-between align-items-center bg-black text-bg-light p-2 border-2 gap-5 rounded-md">
            <img src={productDetail.image} className="w-12"></img>
            <h3>productDetail.productName</h3>
            <p>&{productDetail.price * quanlity}</p>
            <div className="w-20 flex justify-content-between">
                <button className="bg-warning-subtle rounded-full w-6 h-6" onClick={handleMinusQuanlity}>-</button>
                <span>{quanlity}</span>
                <button className="bg-warning-subtle rounded-full w-6 h-6" onClick={handlePlusQuanlity}>+</button>
            </div>
        </div>
    )
}
export default CartItem;