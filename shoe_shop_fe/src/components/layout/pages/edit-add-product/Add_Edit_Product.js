import React,{useState, useEffect} from "react";
import "./add-edit-product.css";
import assets from "../../../../assets/assets.gif";
import axios from "axios";
import {useNavigate,useParams } from "react-router-dom";
import {useSelector} from "react-redux";
import useConfirmExit from '../../../useConfirmExit';


const Add_Edit_Product = () => {
  useConfirmExit();
  const color_size_remaining = () => {
    return [{ color: "", size: [{ value: "", remaining: ""}] }];
  };

  const [colorRows, setColorRows] = useState(color_size_remaining());
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);


  //add + remove Row for size-color-remaining and category

  const addDiv = ({ colorIndex }) => {
    setColorRows(prevColorRows => {
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

  const removeRow = (colorIndex, index) => {
    setColorRows(prevColorRows => {
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

  const addColorRow = () => {
    setColorRows([...colorRows, {color: "", size: [{ value: "", remaining: ""}] }]);
  };

  // const handleChangecolorRows = (index, field, value) => {
  //   setColorRows(prevColorRows => {
  //     const updatedRows = [...prevColorRows];
  //     updatedRows[index][field] = value;
  //     return updatedRows;
  //   });
  // };

  const handleChangecolorRows = (colorIndex, sizeIndex, field, value) => {
    if (field === "color") { // Check if the field is "color"
      setColorRows(prevColorRows => {
        const updatedRows = [...prevColorRows];
        updatedRows[colorIndex][field] = value;
        return updatedRows;
      });
    } else if (field === "value" || field === "remaining") {
      setColorRows(prevColorRows => {
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
    setColorRows(updatedcolorRows);
  };


      //Image create and delete 

      useEffect(() => {
        // reload hình ảnh khi imageList bị thay đổi
        //console.log("Image list changed, reloading...");
      }, [imageList]);
      

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
            const newList = [...imageList];
            newList.splice(index, 1);
            setImageList(newList);
          })
          .catch((error) => {
            console.log(error);
          });
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
            setImageList((prevUrls) => prevUrls.concat(res.data));
          })
          .then(() => setLoading(false))
          .catch(console.log);
      }
    
      function uploadMultipleImages(images) {
        setLoading(true);
        axios
          .post(`${process.env.REACT_APP_API_URL}image/uploadMultipleImages`, { images })
          .then((res) => {
            setImageList((prevUrls) => prevUrls.concat(res.data));
          })
          .then(() => setLoading(false))
          .catch(console.log);
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
      //(Image create and delete )


      //(edit product)
      const { id } = useParams();
      const [productDetail, setProductDetail] = useState(null);
      const [hasProductDetail, setHasProductDetail] = useState(false);
      const user = useSelector((state) => state.auth.login.currentUser);
      const navigate = useNavigate();

      useEffect(() => {
        if (id) {
          axios
            .get(`${process.env.REACT_APP_API_URL}products/${id}?sort=size`)
            .then((res) => {
              setProductDetail(res.data);
            })
            .catch(console.log);
        }
      }, [id]);

      useEffect(() => {
        if (productDetail !== null) {
          setHasProductDetail(true);
          setColorRows(productDetail.packing || []);
          setPrice(productDetail.price);
          setGender(productDetail.gender);
          setCategory(productDetail.category);
          setDescription(productDetail.description);
          setTitle(productDetail.title);
          setImageList(productDetail.img);
          setBrand(productDetail.brand);
          console.log(productDetail);
        }
      }, [productDetail]);

      //(edit product)



  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      title : title,
      price : price,
      brand: brand,
      gender: gender,
      img: imageList,
      packing : colorRows,
      category: category,
      description: description
    };
    console.log(newProduct);
    if(!id){
      axios
      .post(`${process.env.REACT_APP_API_URL}products/add`, newProduct )
       // eslint-disable-next-line
      .then((res) => {
        alert("Success");
        navigate("/PageAdmin/");
      })
      .catch(console.log);
    }else{
      axios
      .put(`${process.env.REACT_APP_API_URL}products/${id}`, newProduct )
       // eslint-disable-next-line
      .then((res) => {
        alert("Success");
        navigate(`/Products/${id}`);
      })
      .catch(console.log);
    }}



  return (
    <>
    {user && user.isAdmin? (
    <div className="form-product">
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input type="text" id="title" name="title" value={title||""} onChange={(e)=>setTitle(e.target.value)} required/>

      <div className="form-row">
        <div className="form-row-group">
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" required pattern="[0-9]+([\.,][0-9]+)?" value={price||""} onChange={(e)=>setPrice(e.target.value)}/>
        </div>
        <div className="form-row-group">
          <label htmlFor="brand">Brand:</label>
          <input type="text" id="brand" name="brand" required value={brand||""} onChange={(e)=>setBrand(e.target.value)} />
        </div>
        <div className="form-row-group">
          <label htmlFor="gender">Gender:</label>
          <input type="text" id="gender" name="gender" required value={gender||""} onChange={(e)=>setGender(e.target.value)} />
        </div>
      </div>

      <div className="form-group">
            <label htmlFor="img">Image:</label>
            <div className="imgupload1">
      {loading ? (
        <div className="imgupload">
        <img src={assets} />{" "}
        </div>) : (<div className="imgupload"><UploadInput /></div>)}
        {imageList.length > 0?(
          <div className="block float-left max-w-none">
            <ul className="ulset">
              {imageList.map((url, index) => (
              <li className="ulset" key={index}>
                <img src={url}   alt={`Image ${index}`}/>
                <button className="img-delete" type="button" onClick={() => handleDeleteImage(url,index)}>
                  X</button>
              </li>))}</ul></div>):(<div></div>)}</div></div>

      <div className="table-wrapper">
        <table>
        <thead>
          <tr>
            <th className="color-column">Color:</th> 
            <th className="size-remaining-column">Size-Remaining:</th>
            <th className="add-column"><button className="td-set-add set-add" type="button" onClick={addColorRow}>Add</button></th>
          </tr>
          </thead>
          <tbody>
          {colorRows.map((rowf,colorIndex)=>(
          <tr key={colorIndex}>
            <td className="color-cell"><input type="text" id="color" name="color" value={rowf.color || ""} required onChange={(e) => handleChangecolorRows(colorIndex,0 ,"color", e.target.value)}/></td>
            <td className="size-remaining-cell">
            {rowf.size && rowf.size.length > 0 && rowf.size.map((row, index) => (
              <div key={index}>
              <div className="input-s-r">
              <input type="text" id="size" name="size" placeholder="size..." pattern="^(?:[1-9]|[1-3][0-9]|4[0-5])$" value={row.value|| ""} required onChange={(e) => handleChangecolorRows(colorIndex, index, "value", e.target.value)}/>
              <input type="text" id="remaining" name="remaining" placeholder="remaining..." pattern="^[0-9]*$" value={row.remaining|| ""} onChange={(e) => handleChangecolorRows(colorIndex, index, "remaining", e.target.value)}/>
              {rowf.size.length > 1 && (
              <button className="remove-row set-del" type="button" onClick={() => removeRow(colorIndex,index)}>
                x
              </button>
            )}
              </div>
              {index === rowf.size.length-1 && (
              <button className="td-set-add set-add" type="button" onClick={()=>addDiv({colorIndex})}>Add</button>)}</div>))}
            </td>
            <td className="td-set"><button className="td-set-del set-del" type="button" onClick={() => removecolorRows(colorIndex)}>Del</button></td>
          </tr>
           ))} 
          </tbody>
        </table>

    </div>

      <label htmlFor="category">Category:</label>
      <input type="text" id="category" name="category" value={category||""} required onChange={(e) => setCategory(e.target.value)}/>


      <label htmlFor="description">Description:</label>
      <textarea id="description" name="description"  value={description||""} onChange={(e) => setDescription(e.target.value)}></textarea>
      {hasProductDetail ?(<button className="submit-form" type="submit">Edit</button>):(
      <button className="submit-form" type="submit">Submit</button>)}
    </form>
</div>
    ):(
      <div className="container">
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/">Go back to Homepage</a>
      </div>)}
      </>
  );
}

export default Add_Edit_Product;