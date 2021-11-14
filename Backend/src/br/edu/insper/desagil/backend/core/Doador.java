package br.edu.insper.desagil.backend.core;

import java.util.List;

import br.edu.insper.desagil.backend.database.firestore.FirestoreObject;

public class Doador extends FirestoreObject {
	private String cpf;
	private String nome;
	private String foto;
	private List<String> chavesGatos;

	public String getCpf() {
		return cpf;
	}
	public void setCpf(String cpf) {
		this.cpf = cpf;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getFoto() {
		return foto;
	}
	public void setFoto(String foto) {
		this.foto = foto;
	}
	public List<String> getChavesGatos() {
		return chavesGatos;
	}
	public void setChavesGatos(List<String> chavesGatos) {
		this.chavesGatos = chavesGatos;
	}

	@Override
	public String key() {
		return cpf;
	}
}
