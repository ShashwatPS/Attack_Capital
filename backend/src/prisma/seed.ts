import  { getPrismaClient } from './client.js'
import dotenv from 'dotenv'

dotenv.config()

const prisma = getPrismaClient()

async function main() {
  const employees = await Promise.all([
    prisma.visitor.create({
      data: {
        name: "Shashwat Singh",
        phone: "web_call"      // Hardconding this because of test data 
      }
    }),
    prisma.employee.create({
      data: {
        name: "Rohan Sharma",
        department: "Engineering",
        location: "Bengaluru, Tower A, 5th Floor"
      }
    }),
    prisma.employee.create({
      data: {
        name: "Priya Iyer",
        department: "Marketing",
        location: "Mumbai, Tower B, 3rd Floor"
      }
    }),
    prisma.employee.create({
      data: {
        name: "Amit Verma",
        department: "Sales",
        location: "Delhi, Tower A, Ground Floor"
      }
    }),
    prisma.employee.create({
      data: {
        name: "Neha Gupta",
        department: "HR",
        location: "Gurugram, Tower C, 2nd Floor"
      }
    }),
    prisma.employee.create({
      data: {
        name: "Arjun Reddy",
        department: "Finance",
        location: "Hyderabad, Tower B, 4th Floor"
      }
    })
  ])

  console.log('Seeded employees:', employees)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
 })