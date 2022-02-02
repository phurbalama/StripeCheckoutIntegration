const cors = require("cors")
const express = require("express")
const stripe = require("stripe")("sk_test_51KOcviDNeQdECHUYokJAGmGDNfGLbgmHtuWhxARrWXY9ASrXVPd5qvANVknKouf9HGSiZ4XfClQx9DqcQoyrgGNg00RmqW4s5N")
const uuid = require("uuid").v4

const app = express();


//middleware
app.use(express.json())
app.use(cors())

//routes
app.get("/",(req,res)=>{
    res.send("IT works at learncode online")
});

app.post("/payment",(req,res) => {

    const {product, token} = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE ",product.price);
    const idempotencyKey = uuid()
    console.log(idempotencyKey);

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of product.name`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        },{idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))
})

//listen

app.listen(8282,() => console.log("listening at PORT 8282"))