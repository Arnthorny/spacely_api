const defaultRespObjProperties = {
  status: {
    type: 'integer',
  },
  message: {
    type: 'string',
    example: 'Example Message',
  },
};

const defaultErrObjProperties = {
  status: {
    type: 'integer',
  },
  error: {
    type: 'string',
    example: 'Example Error',
  },
};

function genJsonObjRes(status, schema, description, error = false) {
  const jsonObjRes = {
    description,
    content: {
      type: 'application/json',
      schema: {
        type: 'object',
        properties: {},
      },
    },
  };

  if (!error) {
    jsonObjRes.content.schema.properties = {
      ...defaultRespObjProperties,
      data: { $ref: schema },
    };
  } else {
    jsonObjRes.content.schema.properties = {
      ...defaultErrObjProperties,
      data: { $ref: schema },
    };
  }
  jsonObjRes.content.schema.properties.status.example = status

  return jsonObjRes;
}

const schemas = {
  GenericErrorObj: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        example: 'error message',
      },
      status: {
        type: 'integer',
      },
    },
  },
  OrganisationCreateRequestBodySchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Org Name',
      },
      owner: {
        type: 'string',
        example: 'Full name of Org owner',
      },
      email: {
        type: 'string',
        example: 'email@orgname.com',
      },
    },
  },
  OrganisationCreateResponseSchema: {
    type: 'object',
    properties: {
      ...defaultRespObjProperties,
      data: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85',
          },
          email: {
            type: 'string',
            example: 'email@example.com',
          },
          ownerId: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85',
          },
        },
      },
    },
  },
};

const responses = {
  OrgCreation201ResponseSchema: genJsonObjRes(201,
    '#/components/schemas/OrganisationCreateRequestBodySchema',
    'Organisation Created',
  ),
  Generic400ResponseSchema: genJsonObjRes(400,
    '#/components/schemas/GenericErrorObj', 'Bad Request', true
  ),
  Generic401ResponseSchema: genJsonObjRes(401,
    '#/components/schemas/GenericErrorObj', 'Unauthorized', true
  ),
  Generic403ResponseSchema: genJsonObjRes(403,
    '#/components/schemas/GenericErrorObj', 'Forbidden', true
  ),
  Generic422ResponseSchema: genJsonObjRes(422,
    '#/components/schemas/GenericErrorObj', 'Invalid fields', true
  ),
  Generic404ResponseSchema: genJsonObjRes(404,
    '#/components/schemas/GenericErrorObj', 'Not found', true
  ),
  Generic500ResponseSchema: genJsonObjRes(500,
    '#/components/schemas/GenericErrorObj', 'Internal Server Error', true
  ),
};

module.exports = { schemas, responses };
