

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import dotenv2 from "dotenv";
import path from "path";
import express3 from "express";

// src/config/db/index.ts
import "express";

// src/config/connection/Index.ts
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var Index_default = pool;

// src/config/db/index.ts
var initDB = async () => {
  try {
    await Index_default.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await Index_default.query(`
  CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL
    CHECK (char_length(title) <= 150),

    description TEXT NOT NULL
    CHECK (char_length(description) >= 20),

    type VARCHAR(20) NOT NULL
    CHECK (type IN ('bug', 'feature_request')),

    status VARCHAR(20) DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved')),

    reporter_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);
    console.log("Database Initialized Successfully! \u{1F680}");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
var db_default = initDB;

// src/modules/user/user.route.ts
import express from "express";

// src/modules/user/user.service.ts
import "stream/consumers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var registerUserService = async (userData) => {
  try {
    const { name, email, password, role } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await Index_default.query(
      `
    INSERT INTO users (name, email, password, role)
    VALUES($1,$2,$3,$4) RETURNING id, name, email, role, created_at
    `,
      [name, email, hashedPassword, role]
    );
    return {
      success: true,
      message: "User Registered Successfully!",
      data: result.rows[0]
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var loginUserService = async (loginData) => {
  try {
    const { email, password } = loginData;
    const result = await Index_default.query(`SELECT * FROM users WHERE email = $1`, [
      email
    ]);
    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Invalid email"
      };
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid password"
      };
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    return {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var getAllUserService = async () => {
  try {
    const res = await Index_default.query(`
      SELECT id, name, email, role, created_at, updated_at FROM users
    `);
    return {
      success: true,
      message: "Users retrieved successfully",
      data: res.rows
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};

// src/modules/user/user.controller.ts
var registerUserController = async (req, res) => {
  try {
    const result = await registerUserService(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var loginUserController = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1e3 * 24
    });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllUserController = async (req, res) => {
  try {
    const result = await getAllUserService();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};

// src/middleware/auth/auth.middleware.ts
import jwt2 from "jsonwebtoken";
var authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }
    const decoded = jwt2.verify(
      token,
      process.env.SECRET_KEY
    );
    const result = await Index_default.query(
      `SELECT * FROM users WHERE id = $1`,
      [decoded.id]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};

// src/modules/user/user.route.ts
var router = express.Router();
router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/", authMiddleware, getAllUserController);
var user_route_default = router;

// src/modules/issues/issues.route.ts
import express2 from "express";

// src/modules/issues/issues.service.ts
var createIssuesService = async (issuesData, userData) => {
  try {
    const { title, description, type } = issuesData;
    if (!title || !description || !type) {
      return {
        success: false,
        message: "Title, description, and type are required."
      };
    }
    const reporter_id = userData.id;
    const res = await Index_default.query(
      `
      INSERT INTO issues (title,description,type,reporter_id)  VALUES ($1, $2, $3, $4)  RETURNING *
      `,
      [title, description, type, reporter_id]
    );
    const issues = res.rows[0];
    return {
      success: true,
      message: "Issues Create successfull!",
      issues
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var getAllIssuesService = async () => {
  try {
    const result = await Index_default.query(`
      SELECT * FROM issues
    `);
    if (result.rows.length === 0) {
      return {
        success: true,
        message: "No issues available",
        issues: []
      };
    }
    return {
      success: true,
      message: "All issues retrieved successfully",
      issues: result.rows
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      issues: []
    };
  }
};
var getIssuesByIdService = async (id) => {
  try {
    const res = await Index_default.query(
      `
        SELECT * FROM issues WHERE id=$1 
        `,
      [id]
    );
    if (res.rows.length === 0) {
      return {
        success: false,
        message: "Issues not found"
      };
    }
    return {
      success: true,
      message: "Issue found",
      issue: res.rows
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};
var updateIssueService = async (id, updateData) => {
  try {
    const { title, description, type, status } = updateData;
    const res = await Index_default.query(
      `
      UPDATE issues SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        status = COALESCE($4, status)
      WHERE id = $5
      RETURNING *
      `,
      [title, description, type, status, id]
    );
    if (res.rows.length === 0) {
      return {
        success: false,
        message: "Issue never found",
        data: {}
      };
    }
    return {
      sucess: true,
      message: "Issue Update successfully!!",
      issue: res.rows[0]
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// src/modules/issues/issues.controller.ts
var createIssuesController = async (req, res) => {
  try {
    const result = await createIssuesService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var getIssuesController = async (req, res) => {
  try {
    const result = await getAllIssuesService();
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("GetIssuesController Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};
var getIssuesByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Issue id is required"
      });
    }
    const result = await getIssuesByIdService(id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("GetIssuesByIdController Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};
var updateIssueController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateIssueService(id, req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// src/middleware/roles/roleMiddleware.ts
var roleMiddleware = (roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission"
      });
    }
    next();
  };
};
var roleMiddleware_default = roleMiddleware;

// src/modules/issues/issues.route.ts
var router2 = express2.Router();
router2.post("/create", authMiddleware, createIssuesController);
router2.get("/", authMiddleware, roleMiddleware_default(["contributor", "maintainer"]), getIssuesController);
router2.get("/:id", authMiddleware, getIssuesByIdController);
router2.put("/update/:id", authMiddleware, roleMiddleware_default(["maintainer"]), updateIssueController);
var issues_route_default = router2;

// src/app.ts
import cookieParser from "cookie-parser";
dotenv2.config({ path: path.resolve(process.cwd(), ".env") });
var app = express3();
app.use(cookieParser());
app.use(express3.json());
db_default();
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is Cooking Now! \u{1F373}",
    url: "http://localhost:3001",
    project: "Assignment Base API Server",
    author: "Md. Rasel Hossain Emeli",
    platform: "Programming Hero"
  });
});
app.use("/users", user_route_default);
app.use("/issues", issues_route_default);
var app_default = app;

// src/server.ts
var port = 3001;
app_default.listen(port, () => {
  console.log(`server link http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map