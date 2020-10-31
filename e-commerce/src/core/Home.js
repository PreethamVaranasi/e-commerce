import React,{useState,useEffect} from 'react'
import { getProducts } from './helper/coreapicalls'
import Base from './Base'
import "../styles.css"
import Card from './Card'
export default function Home() {

    const [products,setProducts] = useState([])
    const [error,setError] = useState(false)
    
    const loadAllProducts = ()=>{
        getProducts()
        .then(data => {
            if(data.error){
                setError(data.error)
            }else {
                console.log(data)
                setProducts(data)
            }
        })
        .catch(err => console.log(err))
    }

    useEffect(() => { loadAllProducts() }, [])

    return (
        <Base title="My Store" description="Welcome to My Store">
            <h2>Home Compoenent</h2>
            <div className = "row">
                {products.map((product,index) => {
                    return (
                        <div key = {index} className="col-4 mb-4">
                            <Card product={product}/>
                        </div>
                    )
                })}
            </div>
        </Base>
    )
}
