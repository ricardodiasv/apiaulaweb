// Importar a conexão com banco de dados
import { DataSource } from "typeorm";
// Importar a entidade
import { User } from "../entity/Users";
import { Situation } from "../entity/Situations";

export default class CreateUsersSeeds{
  public async run(dataSource: DataSource): Promise<void>{
    console.log("Iniciandoi o seed para a tabela 'users'...");

    // Obter o repositório da entidade User e Situation
    const userRepository = dataSource.getRepository(User);
    const situationRepository = dataSource.getRepository(Situation);

    // Verifica se já existem registros na tabela
    const existingCount = await userRepository.count();
    if(existingCount > 0){
      console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
      return;
    }

    // Buscar a situação no banco de dados
    const situation = await situationRepository.findOne({ where: { id: 1 } });

    // Verificar se encontrou a situação no banco de dados
    if(!situation){
      console.error("Erro: Nenhuma situação encontrada com ID 1. Verifique se a tabela 'situations' está populada.");
      return;
    }

    // Criar os usuários com a referência correta à situação
    const users = [
      {
        id: 1,
        name: "Ricardo Gabriel",
        email: "ricardo@ricardo.com.br",
        password : "123456",
        situation: situation,
      },
      {
        id: 2,
        name: "Pedro",
        email: "pedro@ricardo.com.br",
        password : "123456",
        situation: situation,
      },
    ];

    // Salvar os registros no banco de dados
    await userRepository.save(users);
    console.log("Seed concluído com sucesso: usuarios cadastrados!")
  
  }
}

