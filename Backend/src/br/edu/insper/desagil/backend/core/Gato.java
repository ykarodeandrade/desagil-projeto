package br.edu.insper.desagil.backend.core;

import java.util.Date;

import br.edu.insper.desagil.backend.database.firestore.AutokeyFirestoreObject;

public class Gato extends AutokeyFirestoreObject {
	private String foto;
	private String nome;
	private Genero genero;
	private String raca;
	private Pelagem pelagem;
	private Olhos olhos;
	private Date dataNascimento;
	private Date dataResgate;

	public String getFoto() {
		return foto;
	}
	public void setFoto(String foto) {
		this.foto = foto;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public Genero getGenero() {
		return genero;
	}
	public void setGenero(Genero genero) {
		this.genero = genero;
	}
	public String getRaca() {
		return raca;
	}
	public void setRaca(String raca) {
		this.raca = raca;
	}
	public Pelagem getPelagem() {
		return pelagem;
	}
	public void setPelagem(Pelagem pelagem) {
		this.pelagem = pelagem;
	}
	public Olhos getOlhos() {
		return olhos;
	}
	public void setOlhos(Olhos olhos) {
		this.olhos = olhos;
	}
	public Date getDataNascimento() {
		return dataNascimento;
	}
	public void setDataNascimento(Date dataNascimento) {
		this.dataNascimento = dataNascimento;
	}
	public Date getDataResgate() {
		return dataResgate;
	}
	public void setDataResgate(Date dataResgate) {
		this.dataResgate = dataResgate;
	}
}
