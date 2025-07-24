let postCounter = 1;

export function generateTestPost() {
  const count = postCounter++;
  return {
    title: `Título de Teste ${count}`,
    content: `Conteúdo de Teste ${count}`,
  };
}
