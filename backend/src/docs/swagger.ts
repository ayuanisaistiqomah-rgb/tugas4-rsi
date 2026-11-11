import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '2.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  // Tombol "Authorize" di Swagger UI. Isi dengan: Bearer <token dari login>
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Ketik: Bearer <token dari POST /api/v1/auth/login>',
    },
  },
  definitions: {
    RegisterInput: {
      $name: 'Nisa Zhaafirah',
      $email: 'nisa.tugas3@student.test',
      $password: 'contoh_password_123',
    },
    LoginInput: {
      $email: 'admin@kantin.test',
      $password: 'contoh_password_123',
    },
    StallInput: {
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: 'Nasi goreng dadakan',
    },
    StallUpdate: {
      description: 'Deskripsi baru warung',
    },
    ReviewInput: {
      $rating: 5,
      comment: 'Enak dan porsinya pas',
    },
    MenuItemInput: {
      $stallId: 5,
      $name: 'Es Jeruk Peras',
      $price: 6000,
      isAvailable: true,
    },
    MenuItemUpdate: {
      price: 16000,
    },
    UserInput: {
      $name: 'Sausan Nisa',
      $email: 'sausan@student.test',
      $password: 'contoh_password_123',
      role: 'customer',
    },
    LikeInput: {
      $reviewId: 1,
      $userId: 13,
    },
    FlagStatusUpdate: {
      $status: 'resolved',
    },
    AuditLogInput: {
      $userId: 1,
      $action: 'UPDATE',
      $targetTable: 'FLAGS',
      $targetId: 1,
      metadata: { status: 'resolved' },
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);