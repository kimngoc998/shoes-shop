import React, { useRef, useState, useEffect } from "react";
// import { render } from "react-dom";
import axios from "axios";
import assets from "../../../../assets/assets.gif";
import {BiPencil    } from 'react-icons/bi';
import {AiFillCloseSquare ,AiOutlineSortAscending   ,AiOutlineSortDescending  } from 'react-icons/ai';
import "./edit_products.css"

import {
  Button,
  Segment,
  Table,
} from "semantic-ui-react";
import { useNavigate} from "react-router-dom";
export const Edit_Products = () => {
  const formRef = useRef(null);

  

  const color_size_remaining = () => {
    return [{ color: "", size: [{ value: "", remaining: ""}] }];
  };
   const [colorRows, seteditedColorRows] = useState(color_size_remaining());
    const [editedPrice, seteditedPrice] = useState([]);
    const [editedBrand, seteditedBrand] = useState([]);
    const [editedgender, seteditedGender] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [brandSortOrder, setBrandSortOrder] = useState("asc");

    const [editedCategory, seteditedCategory] = useState("");
  const [editedDescription, seteditedDescription] = useState("");
    const [editedTitle, seteditedTitle] = useState([]);
   const [editedImageList, seteditedImageList] = useState([]);
    const [loading, setLoading] = useState(false);
     // eslint-disable-next-line
    const [editingId, setEditingId] = useState(null);
    const [products,setProducts] = useState([]);
    const [hasProductDetail, setHasProductDetail] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEdit_id, setIsEdit_id] = useState("");
    const [productDetail, setProductDetail] = useState(null);
    const sortedColorRows = [...colorRows]
    useEffect(() => {
    // Gọi API để lấy dữ liệu từ backend
    axios.get(`${process.env.REACT_APP_API_URL}products/`)
      .then((response) => {
        const sortedProducts = response.data.map(product => {
          // if (product.size_color_remaining) {
          //   const sortedSizes = product.size_color_remaining.sort((a, b) => {
          //     const sizeA = a.size_remaining[0].size;
          //     const sizeB = b.size_remaining[0].size;
          //     return sizeA.localeCompare(sizeB);
          //   });
          //   product.size_color_remaining = sortedSizes;
          // }
          return product;
        });
  
        setProducts(sortedProducts);
       
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [])
  useEffect(() => {
    if (productDetail !== null) {
      setHasProductDetail(true);

          seteditedColorRows(productDetail.packing || []);
          seteditedPrice(productDetail.price);
          seteditedCategory(productDetail.category);
          seteditedDescription(productDetail.description);
          seteditedTitle(productDetail.title);
          seteditedImageList(productDetail.img);
          seteditedBrand(productDetail.brand);
          seteditedGender(productDetail.gender)
          setEditingId(productDetail._id)
      console.log(productDetail);
    }
  }, [productDetail]);

  const handleEditProduct = (productId) => {
    // console.log(products);
    const selected = products.find((product) => product._id === productId);
    setProductDetail(selected)
    setSelectedProduct(selected);
    setIsEditing(true);
    setIsEdit_id(productId);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
    
  const navigate = useNavigate();

 const handleSubmit = async (productId) => {
      // console.log(productId)
     const newProduct = {
       title : editedTitle,
       price : editedPrice,
       brand: editedBrand,
       img: editedImageList,
       packing : colorRows,
       category: editedCategory,
       description: editedDescription
      }
      
      axios
      .put(`${process.env.REACT_APP_API_URL}products/${productId}`, newProduct )
       // eslint-disable-next-line
      .then((res) => {
        alert("Success");
        setIsEditing(false);
        setIsEdit_id("");
        navigate(`/PageAdmin/`);
      })
      .catch(console.log);
    }
    



    function UploadInput() {
      return (
        <div className="flex float-left max-w-none items-center justify-center w-full " style={{ paddingTop: '2px' , marginLeft:"5px" }}>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full "
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6" style={{ marginLeft: '100%' }}>
              <svg
                aria-hidden="true"
                width="34px"
                height="40px"
                className="mb-3 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
            </div>
            <input
              onChange={uploadImage}
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              style={{ display: 'none' }}
            />
          </label>
        </div>
      );
    }
const uploadImage = async (event) => {
  const files = event.target.files;
  console.log(files.length);

  if (files.length === 1) {
    const base64 = await convertBase64(files[0]);
    uploadSingleImage(base64);
    return;
  }

  const base64s = [];
  for (var i = 0; i < files.length; i++) {
    var base = await convertBase64(files[i]);
    base64s.push(base);
  }
  uploadMultipleImages(base64s);
};
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
function uploadSingleImage(base64) {
  setLoading(true);
  axios
    .post(`${process.env.REACT_APP_API_URL}image/uploadImage`, { image: base64 })
    .then((res) => {
      seteditedImageList((prevUrls) => prevUrls.concat(res.data));
    })
    .then(() => setLoading(false))
    .catch(console.log);
}
function uploadMultipleImages(images) {
  setLoading(true);
  axios
    .post(`${process.env.REACT_APP_API_URL}image/uploadMultipleImages`, { images })
    .then((res) => {
      seteditedImageList((prevUrls) => prevUrls.concat(res.data));
    })
    .then(() => setLoading(false))
    .catch(console.log);
}

const handleDeleteImage = (imgUrl, index) => {
  const url = imgUrl;
  const parts = url.split("/");
  const publicIdWithExtension = parts[parts.length - 1];
  // const publicId = publicIdWithExtension.slice(0, -4);
  const publicId = publicIdWithExtension.split('.')[0];

  axios
    .delete(`${process.env.REACT_APP_API_URL}image/${publicId}`)
    .then(() => {
      // Xóa phần tử khỏi mảng imageList
      const newList = [...editedImageList];
      newList.splice(index, 1);
      seteditedImageList(newList);
    })
    .catch((error) => {
      console.log(error);
    });
};
const addColorRow = () => { 
  seteditedColorRows([...colorRows, {color: "", size: [{ value: "", remaining: ""}] }]);
};
const handleChangecolorRows = (colorIndex, sizeIndex, field, value) => {
  if (field === "color") { // Check if the field is "color"
    seteditedColorRows(prevColorRows => {
      const updatedRows = [...prevColorRows];
      updatedRows[colorIndex][field] = value;
      return updatedRows;
    });
  } else if (field === "value" || field === "remaining") {
    seteditedColorRows(prevColorRows => {
      const updatedRows = [...prevColorRows];
      const colorRow = updatedRows[colorIndex];
      const updatedSizeRemaining = [...colorRow.size];

      // if (!updatedSizeRemaining[sizeIndex]) {
      //   // Create a new size row if it doesn't exist
      //   updatedSizeRemaining[sizeIndex] = {};
      // }

      updatedSizeRemaining[sizeIndex][field] = value;
      colorRow.size = updatedSizeRemaining;
      return updatedRows;
    });
  }
};
const removecolorRows = (index) => {
  const updatedcolorRows = [...colorRows];
  updatedcolorRows.splice(index, 1);
  seteditedColorRows(updatedcolorRows);
};
const removeRow = (colorIndex, index) => {
  seteditedColorRows(prevColorRows => {
    const newColorRows = prevColorRows.map((row, rowIndex) => {
      if (rowIndex === colorIndex) {
        return {
          ...row,
          size: row.size.filter((_, i) => i !== index)
        };
      }
      return row;
    });
    return newColorRows;
  });
};
const addDiv = ({ colorIndex }) => {
  
  seteditedColorRows(prevColorRows => {
    const newColorRows = prevColorRows.map((row, index) => {
      if (index === colorIndex) {
        return {
          ...row,
          size: [
            ...(row.size || []),
            { size: "", remaining: "" }
          ]
        };
      }
      return row;
    });
    return newColorRows;
  });
};

sortedColorRows.forEach((item)=>
{
  
  item.size.sort((a, b) => {
    const sizeA = a.value;
    const sizeB = b.value;
    return sizeA.localeCompare(sizeB);
  })
})
const handleDeleteProduct = (productId) => {
  if (window.confirm("Are you sure you want to delete this product?")) { 
    axios.delete(`${process.env.REACT_APP_API_URL}products/del/${productId}`)
      .then(() => {
        alert("Product deleted successfully");
        // Tải lại danh sách sản phẩm sau khi xóa
        axios.get(`${process.env.REACT_APP_API_URL}products/`)
          .then((response) => {
            setProducts(response.data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  }
};
const handleSortTitle = () => {
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });
  setProducts(sortedProducts);
  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
};
const handleSortBrand = () => {
  const sortedProducts = [...products].sort((a, b) => {
    if (brandSortOrder === "asc") {
      return a.brand.localeCompare(b.brand);
    } else {
      return b.brand.localeCompare(a.brand);
    }
  });
  setProducts(sortedProducts);
  setBrandSortOrder(brandSortOrder === "asc" ? "desc" : "asc");
};
        // }).map(user => <Table.Row>
        //     <Table.Cell>
        //       {user.name +
        //         (user.password
        //           ? ' | Pass: "' + user.password + '" !!Attention'
        //           : "")}
        //     </Table.Cell>
        //     <Table.Cell>{user.email}</Table.Cell>
        //     <Table.Cell>{user.role}</Table.Cell>
        //     <Table.Cell>{user.caloryLimit}</Table.Cell>
        //     <Table.Cell>
        //       <Button onClick={() => this.selectUserForEditing(user.id)} size="mini" icon>
        //         <Icon name="pencil" />
        //       </Button>
        //       <Button onClick={() => this.deleteUser(user.id)} color="red" size="mini" icon>
        //         <Icon name="delete" />
        //       </Button>
        //     </Table.Cell>
        //   </Table.Row>);
      

    return (
    <div className="container-productsTable">
        <Segment>
        {/* <Header>Product List</Header> */}
        <Table compact celled id="productsTable">
          <Table.Header fullWidth>
            <Table.Row>
              <Table.HeaderCell><Button onClick={handleSortTitle} icon>
    {sortOrder === "asc" ? <AiOutlineSortAscending /> : <AiOutlineSortDescending />}
  </Button>Title</Table.HeaderCell>
              <Table.HeaderCell>
              <Button onClick={handleSortBrand} icon>{brandSortOrder === "asc" ? <AiOutlineSortAscending /> : <AiOutlineSortDescending />}</Button>
              Brand</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {products.map((product) => 
            <Table.Row key={product._id} className={isEdit_id === product._id ? 'editing' : ''}>
              <Table.Cell>
                {/* {editingId === product._id ? (
                  <Input
                    value={editedTitle}
                    onChange={(e) => seteditedTitle(e.target.value)}
                  />
                ) : (
                  product.title 
                )}
                 */}
                                  {product.title} 

              </Table.Cell>
              <Table.Cell>
              {product.brand} 
              </Table.Cell>

              <Table.Cell>
              {product.price.toLocaleString()}
              </Table.Cell>
              <Table.Cell>
              <Button onClick={() => handleEditProduct(product._id)}  ><BiPencil size={24} />
            </Button>
            <Button onClick={() => handleDeleteProduct(product._id)} color="red" size="mini"><AiFillCloseSquare size={24} />
        
      </Button>
              {/* <Button size= "mini" icon>
             <Icon name='pencil' />
            </Button>
            <Button  color="red" size="mini" icon>
            <Icon name="delete" />
            </Button> */}
             </Table.Cell>
            </Table.Row>
            )}

            </Table.Body>

          {/* <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan={5} />
            </Table.Row>
          </Table.Footer> */}
        </Table>
        </Segment>,


      
      {isEditing && selectedProduct && (
        <Segment>
                  <div className="form-product" ref={formRef}>
    <form onSubmit={handleSubmit}>
       <label htmlFor="title">Title:</label>
      <input type="text" id="title" name="title" value={editedTitle||""} onChange={(e)=>seteditedTitle(e.target.value)} required/>

     <div className="form-row">
        <div className="form-row-group">
           <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" required pattern="[0-9]+([\.,][0-9]+)?" value={editedPrice||""} onChange={(e)=>seteditedPrice(e.target.value)}/>
        </div>
         <div className="form-row-group">
           <label htmlFor="brand">Brand:</label>
           <input type="text" id="brand" name="brand" required value={editedBrand||""} onChange={(e)=>seteditedBrand(e.target.value)} />
         </div>
         <div className="form-row-group">
           <label htmlFor="gender">Gender:</label>
           <input type="text" id="gender" name="gender" required value={editedgender||""} onChange={(e)=>seteditedGender(e.target.value)} />
         </div>
       </div>
      <div className="form-group">
             <label htmlFor="img">Image:</label>
             <div className="imgupload1">
       {loading ? (
        <div className="imgupload">
        <img src={assets} />{" "}
        </div>) : (<div className="imgupload"><UploadInput /></div>)}
        {editedImageList.length > 0?(
          <div className="block float-left max-w-none">
            <ul className="ulset">
              {editedImageList.map((url, index) => (
              <li className="ulset" key={index}>
                <img src={url}   alt={`Image ${index}`}/>
                <button className="img-delete"  type="button"  onClick={() => handleDeleteImage(url,index)}>
                  X</button>
              </li>))}</ul></div>):(<div></div>)}</div></div>

      <div className="table-wrapper">
        <table>
        <thead>
          <tr>
            <th className="color-column">Color:</th> 
            <th className="size-remaining-column">Size-Remaining:</th>
            <th className="add-column"><button className="td-set-add set-add"  type="button" onClick={addColorRow}>Add</button></th>
          </tr>
          </thead>
          <tbody> 
          {sortedColorRows.map((rowf,colorIndex)=>(
          <tr key={colorIndex}>
            <td className="color-cell"><input type="text" id="color" name="color" required value={rowf.color || ""} onChange={(e) => handleChangecolorRows(colorIndex,0 ,"color", e.target.value)}/></td>
            <td className="size-remaining-cell">
            {rowf.size && rowf.size.length > 0 && rowf.size.map((row, index) => (
              <div key={index}>
              <div className="input-s-r">
              <input type="text" id="size" name="size" placeholder="size..." pattern="^(?:[1-9]|[1-3][0-9]|4[0-5])$" value={row.value|| ""} required onChange={(e) => handleChangecolorRows(colorIndex, index, "value", e.target.value)}/>
              <input type="text" id="remaining" name="remaining" placeholder="remaining..." pattern="^(?:[0-9][0-9]*)$" value={row.remaining|| ""} onChange={(e) => handleChangecolorRows(colorIndex, index, "remaining", e.target.value)}/>
              {rowf.size.length > 1 && (
              <button className="remove-row set-del"  type="button" onClick={() => removeRow(colorIndex,index)}>
                x
              </button>
            )}
              </div>
              {index === rowf.size.length-1 && (
              <button className="td-set-add set-add"   type="button" onClick={()=>addDiv({colorIndex})}>Add</button>)}</div>))}
            </td>
            <td className="td-set"><button className="td-set-del set-del"   type="button" onClick={() => removecolorRows(colorIndex)}>Del</button></td>
          </tr>
           ))} 
          </tbody>
        </table>

    </div>

      <label htmlFor="category">Category:</label>
      <input type="text" id="category" name="category" value={editedCategory||""} required onChange={(e) => seteditedCategory(e.target.value)}/>


      <label htmlFor="description">Description:</label>
      <textarea id="description" name="description"  value={editedDescription||""} onChange={(e) => seteditedDescription(e.target.value)}></textarea>
      {hasProductDetail ?(<button className="submit-form" type="submit" onClick={()=> handleSubmit(productDetail._id)}>Edit</button>
      ):(
      <button className="submit-form" type="submit">Submit</button>)}

    </form>
</div>
        </Segment>
     ) }
    </div>
  );
};

export default Edit_Products;  
//         <Segment>
         
//         <div className="form-product">
//     <form onSubmit={handleSubmit}>
//       <label htmlFor="title">Title:</label>
//       <input type="text" id="title" name="title" value={editedTitle||""} onChange={(e)=>seteditedTitle(e.target.value)} required/>

//       <div className="form-row">
//         <div className="form-row-group">
//           <label htmlFor="price">Price:</label>
//           <input type="number" id="price" name="price" required pattern="[0-9]+([\.,][0-9]+)?" value={editedPrice||""} onChange={(e)=>seteditedPrice(e.target.value)}/>
//         </div>
//         <div className="form-row-group">
//           <label htmlFor="brand">Brand:</label>
//           <input type="text" id="brand" name="brand" required value={editedBrand||""} onChange={(e)=>seteditedBrand(e.target.value)} />
//         </div>
//       </div>

//       <div className="form-group">
//             <label htmlFor="img">Image:</label>
//             <div className="imgupload1">
//       {loading ? (
//         <div className="imgupload">
//         <img src={assets} />{" "}
//         </div>) : (<div className="imgupload"><UploadInput /></div>)}
//         {editedImageList.length > 0?(
//           <div className="block float-left max-w-none">
//             <ul className="ulset">
//               {editedImageList.map((url, index) => (
//               <li className="ulset" key={index}>
//                 <img src={url}   alt={`Image ${index}`}/>
//                 <button className="img-delete" onClick={() => handleDeleteImage(url,index)}>
//                   X</button>
//               </li>))}</ul></div>):(<div></div>)}</div></div>

//       <div className="table-wrapper">
//         <table>
//         <thead>
//           <tr>
//             <th className="color-column">Color:</th> 
//             <th className="size-remaining-column">Size-Remaining:</th>
//             <th className="add-column"><button className="td-set-add set-add" onClick={addColorRow}>Add</button></th>
//           </tr>
//           </thead>
//           <tbody>
//           {colorRows.map((rowf,colorIndex)=>(
//           <tr key={colorIndex}>
//             <td className="color-cell"><input type="text" id="color" name="color" value={rowf.color || ""} onChange={(e) => handleChangecolorRows(colorIndex,0 ,"color", e.target.value)}/></td>
//             <td className="size-remaining-cell">
//             {rowf.size_remaining && rowf.size_remaining.length > 0 && rowf.size_remaining.map((row, index) => (
//               <div key={index}>
//               <div className="input-s-r">
//               <input type="text" id="size" name="size" placeholder="size..." pattern="^(?:[1-9]|[1-3][0-9]|4[0-5])$" value={row.size|| ""}  onChange={(e) => handleChangecolorRows(colorIndex, index, "size", e.target.value)}/>
//               <input type="text" id="remaining" name="remaining" placeholder="remaining..." pattern="^(?:[0-9][0-9]*)$" value={row.remaining|| ""} onChange={(e) => handleChangecolorRows(colorIndex, index, "remaining", e.target.value)}/>
//               {rowf.size_remaining.length > 1 && (
//               <button className="remove-row set-del" onClick={() => removeRow(colorIndex,index)}>
//                 x
//               </button>
//             )}
//               </div>
//               {index === rowf.size_remaining.length-1 && (
//               <button className="td-set-add set-add" onClick={()=>addDiv({colorIndex})}>Add</button>)}</div>))}
//             </td>
//             <td className="td-set"><button className="td-set-del set-del"  onClick={() => removecolorRows(colorIndex)}>Del</button></td>
//           </tr>
//            ))} 
//           </tbody>
//         </table>

//     </div>

//       <label htmlFor="category">Category:</label>
//       <input type="text" id="category" name="category" value={editedCategory||""} required onChange={(e) => seteditedCategory(e.target.value)}/>


//       <label htmlFor="description">Description:</label>
//       <textarea id="description" name="description"  value={editedDescription||""} onChange={(e) => seteditedDescription(e.target.value)}></textarea>
//       {hasProductDetail ?(<button className="submit-form" type="submit">Edit</button>):(
//       <button className="submit-form" type="submit">Submit</button>)}
//     </form>
// </div>
//       </Segment>)}
     
    //   const handleSave = async (e ) => {
    //     e.preventDefault();
    //     const newProduct = {
    //       title : editedTitletitle,
    //       price : editedTitleprice,
    //       brand: editedTitlepricebrand,
    //       img: editedImageList,
    //       size_color_remaining : colorRows,
    //       category: editedCategory,
    //       description: editedDescription
    //     };
    //     console.log(newProduct);}
     