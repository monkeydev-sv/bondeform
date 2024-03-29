/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete} from "react-icons/md";
import { RxUpdate } from "react-icons/rx";

import "./index.css";

import jwt_decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";

const Main = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getUsers();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setEmail(decoded.email);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/dashboard");
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setEmail(decoded.email);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getUsers = async () => {
      
        const response = await axiosJWT.get('http://localhost:5000/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
       
        
    }
    const [getNews, setGetNews] = useState([]);

    useEffect(() => {
      getNewsForList();
    }, []);
  
    const getNewsForList = async () => {
      const response = await axios.get("http://localhost:5000/news");
      setGetNews(response.data);
      console.log(response.data)
    };
  
    const deleteNews = async (newsId) => {
      try {
        await axios.delete(`http://localhost:5000/news/${newsId}`);
        getNewsForList();
      } catch (error) {
        console.log(error);
      }
    };
    const [getProducts, setGetProducts] = useState([]);

  useEffect(() => {
    getProductsForList();
  }, []);

  const getProductsForList = async () => {
    const response = await axios.get("http://localhost:5000/products");
    setGetProducts(response.data);
    console.log(response.data)
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      getProductsForList();
    } catch (error) {
      console.log(error);
    }
  };
  
   
 
    return (
        <div className="container">
            <div className="box">
            <div className="box">
   
    <strong>Kontrollpanel</strong> 
    <div class="navbar-end">Inloggad: {name}</div>
            <div class="buttons are-normal">
<a href="/adminnews" className="button">Nyheter</a>
<a href="/adminproduct" className="button">Produkter</a>
<a href="/adminAtelje" className="button">Ateljé</a>
<a href="/adminResale" className="button">Återförsäljare</a>
<a href="/adminAbout" className="button">Om mig</a>
<div class="navbar-end">
<div class="select">
  <select>
    <option>Välj ett teman</option>
    <option>Sommar</option>
    <option>Vinter</option>
    <option>Vår</option>
    <option>Höst</option>
  </select>
</div></div>
</div>


 
                </div>
           <div className="columns">
        <div className="column is-half">
           <div className="box">
            <div className="admin-front-text">Nyheter</div>
            <table>
            
            <tr>
              <td><strong>ID</strong></td>
              <td><strong>Rubrik</strong> </td>
              
              <td>  </td>
              <td> </td>
            </tr>
            {getNews.map((news) => (
              <tr key={news.id}>
                <td>{news.id}</td>
                <td>{news.news} </td>
                <td> <MdDelete className="deletea" onClick={() => deleteNews(news.id)} /> </td>
                <td> <Link to={`/editNews/${news.id}`} ><RxUpdate className="update" /> </Link>  </td>

              </tr>

            ))}

          </table>

          </div>
            </div>
            <div className="column is-half">
           <div className="box">
           <div className="admin-front-text">Produkter</div>
           <table>
            <tr>
              <td><strong>ID</strong></td>
              <td><strong>Namn</strong> </td>
              <td><strong>Pris</strong>  </td>
              <td>  </td>
              <td> </td>
            </tr>
            {getProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name} </td>
                <td> {product.pris} kr </td>
                <td> <MdDelete className="deletea" onClick={() => deleteProduct(product.id)} /> </td>
                <td> <Link to={`/edit/${product.id}`} ><RxUpdate className="update" /> </Link>  </td>

              </tr>

            ))}

          </table>
            </div>
            </div>
        </div>
        </div>
        </div>
    
    )
}

 
export default Main;
