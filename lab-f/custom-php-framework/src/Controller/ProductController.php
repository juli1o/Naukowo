<?php
namespace App\Controller;

use App\Model\Product;
use App\Exception\NotFoundException;
use App\Service\Templating;
use App\Service\Router;

class ProductController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $products = Product::findAll();
        return $templating->render('product/index.html.php', [
            'products' => $products,
            'router' => $router
        ]);
    }

    public function showAction(int $productId, Templating $templating, Router $router): ?string
    {
        $product = Product::find($productId);
        if (!$product) {
            throw new NotFoundException("Product not found: $productId");
        }

        return $templating->render('product/show.html.php', [
            'product' => $product,
            'router' => $router
        ]);
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $product = Product::fromArray($requestPost);
            $product->save();

            $router->redirect($router->generatePath('product-index'));
            return null;
        }

        return $templating->render('product/create.html.php', [
            'product' => new Product(),
            'router' => $router
        ]);
    }

    public function editAction(int $productId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $product = Product::find($productId);
        if (!$product) {
            throw new NotFoundException("Product not found: $productId");
        }

        if ($requestPost) {
            $product->fill($requestPost);
            $product->save();

            $router->redirect($router->generatePath('product-index'));
            return null;
        }

        return $templating->render('product/edit.html.php', [
            'product' => $product,
            'router' => $router
        ]);
    }

    public function deleteAction(int $productId, Router $router): ?string
    {
        $product = Product::find($productId);
        if (!$product) {
            throw new NotFoundException("Product not found: $productId");
        }

        $product->delete();
        $router->redirect($router->generatePath('product-index'));
        return null;
    }
}
