const deleteProduct = (btn) => {
    console.log('clicked')
    const prodId = btn.parentNode.querySelector('[name=productId').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf').value;
};