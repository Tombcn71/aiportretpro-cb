import { Price } from "./Price"

const PricingPage = () => {
  const prices = [
    { id: "price_1RrFsbDswbEJWagVsEytA8rs", name: "Basic Plan", price: 9.99 },
    { id: "price_1RrFTnDswbEJWagVnjXYvNwh", name: "Premium Plan", price: 19.99 },
  ]

  return (
    <div>
      <h1>Pricing Plans</h1>
      <ul>
        {prices.map((price) => (
          <li key={price.id}>
            <Price name={price.name} price={price.price} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PricingPage
