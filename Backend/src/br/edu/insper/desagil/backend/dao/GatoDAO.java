package br.edu.insper.desagil.backend.dao;

import br.edu.insper.desagil.backend.core.Gato;
import br.edu.insper.desagil.backend.database.firestore.FirestoreDAO;

public class GatoDAO extends FirestoreDAO<Gato> {
	public GatoDAO() {
		super("gatos");
	}
}
