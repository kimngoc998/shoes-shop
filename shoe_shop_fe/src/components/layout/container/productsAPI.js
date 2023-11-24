import axios from "axios";

export const getProducts = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}products/`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch products');
    }
}

export const getProduct = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}products/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch product');
    }
}



export const editProduct = async (id, data) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}products/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to edit product');
    }
}

export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}products/del/${id}`);
        // No need to return any data since the product is deleted
    } catch (error) {
        throw new Error('Failed to delete product');
    }
}
