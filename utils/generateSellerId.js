function generateSellerId() {
    const prefix = "seller_";
    const randomNumber = Math.floor(Math.random() * 10000);
    return prefix + randomNumber;
  }
  
  module.exports = generateSellerId;
  