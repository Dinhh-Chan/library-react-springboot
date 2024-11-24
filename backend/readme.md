Here’s the API documentation translated into English:

---

# Table of Contents

[1. Author](#author-api-documentation)  
[2. Book](#book-controller-api-documentation)  
[3. Borrowing](#borrowing-controller-api-documentation)  
[4. Category](#category-controller-api-documentation)  
[5. Inventory](#inventory-controller-api-documentation)  
[6. Reader](#reader-controller-api-documentation)  

---

# Author API Documentation

This API provides functionality to manage author information in the **Library Management** system.

## Base URL
`/api/authors`

---

## 1. Get All Authors

**Endpoint**: `GET /api/authors`  

**Description**: Retrieve a list of all authors.

### Response
#### Success (200)
```json
[
    {
        "id": 1,
        "name": "Marilynne Robinson",
        "bio": "An author with deep insights into humanistic issues."
    },
    {
        "id": 2,
        "name": "Charles Osborne",
        "bio": "Specializes in mystery and fantasy novels."
    }
]
```

## 2. Get Author by ID

**Endpoint**: `GET /api/authors/{id}`  

**Description**: Retrieve detailed information about an author by ID.

### Request
#### URL Parameters
| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| `id`      | Long   | The ID of the author to retrieve. |

### Response
#### Success (200)
```json
{
    "id": 1,
    "name": "Marilynne Robinson",
    "bio": "An author with deep insights into humanistic issues."
}
```

## 3. Create a New Author

**Endpoint**: `POST /api/authors`  

**Description**: Create a new author.

### Request
#### Headers
| Header          | Value              |
|------------------|--------------------|
| `Content-Type`   | `application/json` |

#### Body
```json
{
    "name": "Sang",
    "bio": "An author with deep insights into humanistic issues."
}
```

### Response
#### Success (200)
```json
{
    "id": 34,
    "name": "Sang",
    "bio": "An author with deep insights into humanistic issues."
}
```

## 4. Update Author

**Endpoint**: `PUT /api/authors/{id}`  

**Description**: Update an author's information by ID.

### Request
#### URL Parameters
| Parameter | Type   | Description             |
|-----------|--------|-------------------------|
| `id`      | Long   | The ID of the author to update. |

#### Headers
| Header          | Value              |
|------------------|--------------------|
| `Content-Type`   | `application/json` |

#### Body
```json
{
    "name": "Sang Nguyen Viet",
    "bio": "An author with deep insights into humanistic issues."
}
```

### Response
#### Success (200)
```json
{
    "id": 34,
    "name": "Sang Nguyen Viet",
    "bio": "An author with deep insights into humanistic issues."
}
```

## 5. Delete Author

**Endpoint**: `DELETE /api/authors/{id}`  

**Description**: Delete an author by ID.

### Request
#### URL Parameters
| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| `id`      | Long   | The ID of the author to delete. |

### Response
#### Success (204)
No content.

#### Error (404)
No content.

---

### Other Sections
If you’d like, I can proceed to translate the remaining sections (Book, Borrowing, Category, Inventory, Reader). Let me know!