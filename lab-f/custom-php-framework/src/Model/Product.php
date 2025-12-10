<?php
namespace App\Model;

use App\Service\Config;

class Product
{
    private ?int $id = null;
    private ?string $name = null;
    private ?float $price = null;

    public function getId(): ?int { 
        return $this->id;
    }
    public function setId(?int $id): Product { 
        $this->id = $id; return $this;
    }

    public function getName(): ?string { 
        return $this->name; 
    }
    public function setName(?string $name): Product {
        $this->name = $name; return $this; 
    }

    public function getPrice(): ?float {
        return $this->price; 
        }
    public function setPrice(?float $price): Product {
        $this->price = $price; return $this; 
    }

    public static function fromArray($array): Product
    {
        $product = new self();
        $product->fill($array);
        return $product;
    }

    public function fill($array): Product
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['price'])) {
            $this->setPrice((float)$array['price']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $stmt = $pdo->prepare("SELECT * FROM product");
        $stmt->execute();

        $products = [];
        foreach ($stmt->fetchAll(\PDO::FETCH_ASSOC) as $arr) {
            $products[] = self::fromArray($arr);
        }
        return $products;
    }

    public static function find($id): ?Product
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $stmt = $pdo->prepare("SELECT * FROM product WHERE id = :id");
        $stmt->execute(['id' => $id]);

        $arr = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $arr ? self::fromArray($arr) : null;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));

        if (!$this->getId()) {
            $stmt = $pdo->prepare("INSERT INTO product (name, price) VALUES (:name, :price)");
            $stmt->execute([
                'name' => $this->getName(),
                'price' => $this->getPrice(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $stmt = $pdo->prepare("UPDATE product SET name = :name, price = :price WHERE id = :id");
            $stmt->execute([
                'name' => $this->getName(),
                'price' => $this->getPrice(),
                'id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));

        $stmt = $pdo->prepare("DELETE FROM product WHERE id = :id");
        $stmt->execute(['id' => $this->getId()]);
    }
}
