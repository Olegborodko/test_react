import React, {Component} from 'react';
import { Table } from 'react-bootstrap';
const Axios = require('axios');

class Products extends Component {
  state = {
    products: []
  };

  getLastPage(token){
    return Axios({
      method: 'get',
      url: process.env.REACT_APP_BACKEND_HOST + `/v1/product/get`,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }).then((result) => {
      if (result && result.data && result.data.last_page){
        return result.data.last_page
      } else {
        return false
      }
    }).catch(err => {
      return false
    })
  }

  getProducts(token, page){
    return Axios({
      method: 'get',
      url: process.env.REACT_APP_BACKEND_HOST + `/v1/product/get?page=${page}`,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }).then((result) => {
      if (result && result.data && result.data.data){

        return result.data.data
      } else {
        return []
      }
    }).catch(err => {
      return []
    })
  }

  componentDidMount() {
    let token = localStorage.getItem('token');

    this.getLastPage(token).then((lastPage) => {
      let dataAllPromises = [];

      for (let i = 1; i <= lastPage; i++) {
        dataAllPromises.push(this.getProducts(token, i))
      }
      Promise.all(dataAllPromises).then((res) => {
        //console.log(res);

        let data = [];
        res.forEach((el) => {
          data = data.concat(el);
        });

        this.setState({
          products: data
        });
      })
    });
  }

  render() {
    //const {} = this.props;
    const {products} = this.state;
    console.log(JSON.stringify(products[0], null, 2));

    return (
      <div className='products-block'>
        <Table striped bordered hover className="table-products">
          <thead>
          <tr>
          {products[0] && Object.keys(products[0]).map((item, index) => (
            <th key={index}>
              {item}
            </th>
          ))}
          </tr>

          </thead>
          <tbody>
          {products && products.map((item, index) => (
            <tr key={index}>
              {Object.keys(item).map((it, ind) => (
                <td key={ind}>
                  {it === 'product_image_default' &&
                    <img src={
                      it === 'product_image_default' && item[it][0] && `${process.env.REACT_APP_BACKEND_HOST}/${item[it][0]['file']['file_path']}`
                      //item[it] ? item[it].toString() : ''
                    } className='product-img'/>
                  }

                  {it === 'category' && item[it].map((el, ind) => (
                    <span>
                      {ind === item[it].length-1 && `${el.category_id}`}
                      {ind !== item[it].length-1 && `${el.category_id},`}
                    </span>
                  ))}

                  {it === 'shipping' && item[it] && item[it].shipping_id}

                  {it !== 'product_image_default' &&
                    it !== 'category' &&
                    it !== 'shipping' &&
                    item[it] &&
                    item[it].toString()
                  }
                </td>
              ))}
            </tr>
          ))}

          </tbody>
        </Table>
      </div>
    )
  }
}

export default Products;