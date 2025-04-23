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
    example: '',
  },
  error: {
    type: 'string',
    example: 'Example Error',
  },
};

function genJsonObjRes(
  status,
  schema,
  description,
  error = false,
  dataArray = false,
  extraProps = undefined,
) {
  const jsonObjRes = {
    description,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {},
        },
      },
    },
  };

  if (!error) {
    jsonObjRes.content['application/json'].schema.properties = {
      ...defaultRespObjProperties,
      data: { $ref: schema },
    };
  } else {
    jsonObjRes.content['application/json'].schema.properties = {
      ...defaultErrObjProperties,
    };
  }
  const currStatusProp =
    jsonObjRes.content['application/json'].schema.properties.status;

  jsonObjRes.content['application/json'].schema.properties.status = {
    ...currStatusProp,
    example: status,
  };

  if (extraProps) {
    jsonObjRes.content['application/json'].schema.properties[extraProps.name] =
      extraProps.value;
  }

  if (dataArray) {
    jsonObjRes.content['application/json'].schema.properties.data = {
      type: 'array',
      items: { $ref: schema },
    };
  }

  return { ...jsonObjRes };
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
        example: '',
      },
    },
  },
  EmptyObj: {
    type: 'object',
    properties: {},
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
        format: 'email',
        example: 'email@orgname.com',
      },
    },
  },
  OrganisationCreateResponseSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'email@example.com',
      },
      name: {
        type: 'string',
        example: 'Org name',
      },
      ownerId: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
    },
  },
  UserInviteSignupRequestSchema: {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        example: 'John Doe',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'email@example.com',
      },
      phoneNumber: {
        type: 'string',
        example: '+2348103040303',
      },
      role: {
        type: 'string',
        example: 'learner',
      },
    },
  },
  UserInviteSignupResponseSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      fullName: {
        type: 'string',
        example: 'John Doe',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'email@example.com',
      },
      orgId: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      isActive: {
        type: 'boolean',
        example: 'false',
      },
      inviteId: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
    },
  },
  InviteSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      status: {
        type: 'string',
        example: 'pending',
      },
      expiry: {
        type: 'string',
        format: 'date-time',
        example: '2017-07-21T17:32:28Z',
      },
      orgId: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      userId: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      isExpired: {
        type: 'boolean',
        example: 'false',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2017-07-21T17:32:28Z',
      },
    },
  },
  InviteSchemaWithToken: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      status: {
        type: 'string',
        example: 'pending',
      },
      expiry: {
        type: 'string',
        format: 'date-time',
        example: '2017-07-21T17:32:28Z',
      },
      orgId: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      userId: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      isExpired: {
        type: 'boolean',
        example: 'false',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2017-07-21T17:32:28Z',
      },
      token: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
    },
  },
  UserSigninRequestSchema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
        format: 'password',
      },
    },
  },
  UserSigninResponseSchema: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
      refreshToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85',
          },
          fullName: {
            type: 'string',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          orgId: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85',
          },
          orgName: {
            type: 'string',
            example: 'ALX Nigeria',
          },
          isActive: {
            type: 'boolean',
            example: 'true',
          },
          role: {
            type: 'string',
            example: 'learner',
          },
        },
      },
    },
  },
  UserSetUpPasswordRequestSchema: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        format: 'password',
      },
      confirmPassword: {
        type: 'string',
        format: 'password',
      },
      token: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
    },
  },
  UserSetUpPasswordResponseSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      fullName: {
        type: 'string',
        example: 'John Doe',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      orgId: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      isActive: {
        type: 'boolean',
        example: 'true',
      },
    },
  },
};

const responses = {
  OrgCreation201Response: genJsonObjRes(
    201,
    '#/components/schemas/OrganisationCreateResponseSchema',
    'Organisation Created',
  ),
  UserInviteSignupResponse: genJsonObjRes(
    201,
    '#/components/schemas/UserInviteSignupResponseSchema',
    'Invite Request Created',
  ),
  UserInviteRequestApproveResponse: genJsonObjRes(
    200,
    '#/components/schemas/InviteSchema',
    'Invite approved successfully',
  ),
  UserInviteRequestRejectResponse: genJsonObjRes(
    200,
    '#/components/schemas/InviteSchema',
    'Invite rejected successfully',
  ),
  UserInviteRequestApproveWithTokenResponse: genJsonObjRes(
    200,
    '#/components/schemas/InviteSchema',
    'Invite verified successfully',
  ),
  UserSigninSuccessfulResponse: genJsonObjRes(
    200,
    '#/components/schemas/UserSigninResponseSchema',
    'User signed in successfully',
  ),
  UserSetUpPasswordSuccessfulResponse: genJsonObjRes(
    200,
    '#/components/schemas/UserSetUpPasswordResponseSchema',
    'User password set successfully',
  ),
  SpecificInviteResponseSchema: genJsonObjRes(
    200,
    '#/components/schemas/InviteSchema',
    'Invite retrieved successfully',
  ),

  AllInvitesResponseSchema: genJsonObjRes(
    200,
    '#/components/schemas/InviteSchema',
    'Invite retrieved successfully',
    false,
    true,
  ),
  OrganisationRetrieveListSchema: genJsonObjRes(
    200,
    '#/components/schemas/OrganisationCreateResponseSchema',
    'Organisations retrieved successfully',
    false,
    true,
  ),

  SpecificOrganisationResponseSchema: genJsonObjRes(
    200,
    '#/components/schemas/OrganisationCreateResponseSchema',
    'Organisation retrieved successfully',
  ),
  Generic200Response: genJsonObjRes(
    200,
    '#/components/schemas/EmptyObj',
    'Success',
  ),
  UserResetPwSuccessfulResponse: genJsonObjRes(
    200,
    '#/components/schemas/UserSigninResponseSchema',
    'User password changed successfully',
  ),
  Generic400ResponseSchema: genJsonObjRes(
    400,
    '#/components/schemas/GenericErrorObj',
    'Bad Request',
    true,
  ),
  Generic401ResponseSchema: genJsonObjRes(
    401,
    '#/components/schemas/GenericErrorObj',
    'Unauthorized',
    true,
  ),
  Generic403ResponseSchema: genJsonObjRes(
    403,
    '#/components/schemas/GenericErrorObj',
    'Forbidden',
    true,
  ),
  Generic422ResponseSchema: genJsonObjRes(
    422,
    '#/components/schemas/GenericErrorObj',
    'Invalid fields',
    true,
  ),
  Generic404ResponseSchema: genJsonObjRes(
    404,
    '#/components/schemas/GenericErrorObj',
    'Resource not found',
    true,
  ),
  Generic500ResponseSchema: genJsonObjRes(
    500,
    '#/components/schemas/GenericErrorObj',
    'Internal Server Error',
    true,
  ),
};

module.exports = { schemas, responses };
