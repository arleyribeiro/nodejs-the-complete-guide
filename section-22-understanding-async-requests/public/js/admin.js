const deleteProduct = (btn) => {
    console.log('clicked')
    const prodId = btn.parentNode.querySelector('[name=productId').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf').value;

    fetch(`/admin/product/${prodId}`, {
				method: 'DELETE',
				headers: {
					'csrf-token': csrf
				}
		})
		.then(result => {
			console.log(result)
		})
		.catch(result => {
			console.log(result)
		})
};