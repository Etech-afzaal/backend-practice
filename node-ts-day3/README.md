1. Concept — Three ways to receive data

Type Example Express property
Route parameters /users/5 req.params
Query parameters /users?role=admin req.query
Request body {"name":"Ali"} req.body

# Route parameters — req.params

interface UserParams {
id: string;
}

app.get(
"/users/:id",
(req: Request<UserParams>, res: Response): void => {
const userId = Number(req.params.id);

    res.status(200).json({
      success: true,
      userId
    });

}
);

# Query parameters — req.query

    import type { ParsedQs } from "qs";

interface UserQuery extends ParsedQs {
role?: string;
status?: string;
}

app.get(
"/users",
(
req: Request<{}, unknown, unknown, UserQuery>,
res: Response
): void => {
const { role, status } = req.query;

    res.status(200).json({
      success: true,
      filters: {
        role,
        status
      }
    });

}
);

# Request body — req.body

interface CreateUserBody {
name: string;
email: string;
}

app.post(
"/users",
(
req: Request<{}, unknown, CreateUserBody>,
res: Response
): void => {
const { name, email } = req.body;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        name,
        email
      }
    });

}
);
