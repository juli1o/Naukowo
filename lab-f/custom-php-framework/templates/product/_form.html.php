<?php
/** @var $product ?\App\Model\Product */
?>

<div class="form-group">
    <label for="name">Product name</label>
    <input type="text" id="name" name="product[name]" value="<?= $product ? $product->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="price">Price</label>
    <input type="number" step="0.01" id="price" name="product[price]" value="<?= $product ? $product->getPrice() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Save">
</div>
