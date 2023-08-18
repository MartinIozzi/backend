import ticketModel from "../../models/ticket.model.js";

export default class TicketService{
    constructor(){
        this.model = ticketModel;
    }

    async createTicket(purchaser, amount){
        const generateRandomNumber = () => Math.floor(Math.random() * 99999999) + 99999999;
        const generatedCode = generateRandomNumber(); //verificar que no exista el codigo creado
        try {
            let ticket = {
                purchaser,
                amount,
                purchase_datatime: new Date(),
                code: generatedCode,
            }
            return await this.model.create(ticket)
        } catch (error) {
            console.log("Error al crear el ticket", error);
        }
    }

    async getTickets(){
        try {
            return await this.model.find().lean()
        } catch (error) {
            console.log("Error al traer los ticket", error);
        }
    }

    async getTicketById(id){
        try {
            return await this.model.findOne({ _id: id })
        } catch (error) {
            console.log("Error al traer el ticket por id", error);
        }
    }
}