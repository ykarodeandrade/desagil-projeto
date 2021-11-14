package br.edu.insper.desagil.backend.dao;

import br.edu.insper.desagil.backend.core.Doador;
import br.edu.insper.desagil.backend.database.firestore.FirestoreDAO;

public class DoadorDAO extends FirestoreDAO<Doador> {
	public DoadorDAO() {
		super("doadores");
	}
}
