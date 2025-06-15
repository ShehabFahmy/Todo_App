const express = require("express");
const router = express.Router();
const { dynamodb, TABLE_NAME } = require("../dynamodbClient");
const { v4: uuidv4 } = require("uuid");

// GET all todos
router.get("/", async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "is_complete = :val",
      ExpressionAttributeValues: {
        ":val": false,
      },
    };

    const data = await dynamodb.scan(params).promise();
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to get todos" });
  }
});

// GET todo by ID
router.get("/:id", async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: req.params.id,
      },
    };

    const data = await dynamodb.get(params).promise();

    if (!data.Item) {
      return res.status(404).send({ error: "Todo not found" });
    }

    res.send(data.Item);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to get todo" });
  }
});

// POST new todo
router.post("/", async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ error: "Title is required" });
  }
  
  const todo = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    is_complete: req.body.is_complete || false,
    due_date: req.body.due_date || new Date().toISOString(),
  };

  try {
    const params = {
      TableName: TABLE_NAME,
      Item: todo,
    };

    await dynamodb.put(params).promise();
    res.status(201).send(todo);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create todo" });
  }
});

// PATCH update todo
router.patch("/:id", async (req, res) => {
  try {
    const fields = ["title", "description", "is_complete", "due_date"];
    const updateExpr = [];
    const exprAttrValues = {};
    const exprAttrNames = {};

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateExpr.push(`#${field} = :${field}`);
        exprAttrValues[`:${field}`] = req.body[field];
        exprAttrNames[`#${field}`] = field;
      }
    });

    if (updateExpr.length === 0) {
      return res.status(400).send({ error: "No valid fields to update" });
    }

    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id },
      UpdateExpression: "SET " + updateExpr.join(", "),
      ExpressionAttributeValues: exprAttrValues,
      ExpressionAttributeNames: exprAttrNames,
      ReturnValues: "ALL_NEW",
    };

    const data = await dynamodb.update(params).promise();
    res.send(data.Attributes);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update todo" });
  }
});

// DELETE todo
router.delete("/:id", async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id },
    };

    await dynamodb.delete(params).promise();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete todo" });
  }
});

module.exports = router;
