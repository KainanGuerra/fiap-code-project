export function generateTestUser(role: 'PROFESSOR' | 'STUDENT' = 'PROFESSOR') {
  const timestamp = Date.now(); // garante unicidade
  return {
    name: 'Teste',
    email: `test${timestamp}@example.com`,
    password: '123Abc@!#D',
    role, // pode ser 'PROFESSOR' ou 'ALUNO'
  };
}
