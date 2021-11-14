package br.edu.insper.desagil.backend.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import br.edu.insper.desagil.backend.Backend;
import br.edu.insper.desagil.backend.core.Doador;
import br.edu.insper.desagil.backend.database.firestore.Firestore;

class DoadorDAOTest {
	private static String name;

	private DoadorDAO dao;

	@BeforeAll
	public static void setUpClass() {
		name = Firestore.start(Backend.CREDENTIALS_TEST);
	}

	@BeforeEach
	void setUp() {
		dao = new DoadorDAO();
		dao.deleteAll();
	}

	@Test
	void test() {
		Doador doador;
		doador = new Doador();
		doador.setCpf("12345678910");
		dao.create(doador);
		doador = dao.retrieve("12345678910");
		assertEquals("12345678910", doador.getCpf());
	}

	@AfterAll
	public static void tearDownClass() {
		Firestore.stop(name);
	}
}
