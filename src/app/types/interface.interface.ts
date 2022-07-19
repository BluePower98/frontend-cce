export interface ClienteIndividual {
    idempresa: string;
    rucdni:    string;
    Receptor:  string;
    Tipo:      string;
    Serie:     string;
    numero:    string;
    total:     string;
    FecEmiCom: Date;
    Estado:    null;
}

export interface Login {
    idempresa: string;
    rucdni:    string;
}

export interface ListaCliente {
    rucdni:    string;
    Receptor:  string;
    Tipo:      string;
    Serie:     string;
    numero:    string;
    total:     string;
    FecEmiCom: Date;
    Estado:    null;
}

