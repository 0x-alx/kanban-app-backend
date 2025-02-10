import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as serviceAccount from './firebase-adminsdk.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = getFirestore();
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

async function seedDatabase() {
  try {
    console.log("🔥 Début du peuplement de la base de données Firebase...");

    // 1️⃣ Insérer les BOARDS
    const boardRefs = new Map();
    for (const board of data.boards) {
      const boardRef = await db.collection('boards').add({
        name: board.name,
        createdAt: new Date(board.createdAt),
        updatedAt: new Date(board.updatedAt),
      });
      boardRefs.set(board.id, boardRef.id);
      console.log(`✅ Board ajouté : ${board.name}`);
    }

    // 2️⃣ Insérer les COLUMNS
    const columnRefs = new Map();
    for (const column of data.columns) {
      const columnRef = await db.collection('columns').add({
        boardId: boardRefs.get(column.boardId),
        name: column.name,
        position: column.position,
        createdAt: new Date(column.createdAt),
        updatedAt: new Date(column.updatedAt),
      });
      columnRefs.set(column.id, columnRef.id);
      console.log(`✅ Column ajoutée : ${column.name}`);
    }

    // 3️⃣ Insérer les TASKS
    const taskRefs = new Map();
    for (const task of data.tasks) {
      const taskRef = await db.collection('tasks').add({
        boardId: boardRefs.get(task.boardId),
        columnId: columnRefs.get(task.columnId),
        title: task.title,
        description: task.description,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      });
      taskRefs.set(task.id, taskRef.id);
      console.log(`✅ Task ajoutée : ${task.title}`);
    }

    // 4️⃣ Insérer les SUBTASKS
    for (const subtask of data.subtasks) {
      await db.collection('subtasks').add({
        taskId: taskRefs.get(subtask.taskId),
        title: subtask.title,
        isCompleted: subtask.isCompleted,
        createdAt: new Date(subtask.createdAt),
        updatedAt: new Date(subtask.updatedAt),
      });
      console.log(`✅ Subtask ajoutée : ${subtask.title}`);
    }

    console.log("🎉 La base de données a été peuplée avec succès !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
    process.exit(1);
  }
}

seedDatabase();
