using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class PosgreSqlMigracija : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdministratoriAktivnosti",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ime = table.Column<string>(type: "text", nullable: false),
                    Sifra = table.Column<byte[]>(type: "bytea", nullable: false),
                    Kljuc = table.Column<byte[]>(type: "bytea", nullable: false),
                    Uloga = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdministratoriAktivnosti", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "AdministratoriNamirnica",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ime = table.Column<string>(type: "text", nullable: false),
                    Sifra = table.Column<byte[]>(type: "bytea", nullable: false),
                    Kljuc = table.Column<byte[]>(type: "bytea", nullable: false),
                    Uloga = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdministratoriNamirnica", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DatumRodjenja = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Pol = table.Column<int>(type: "integer", nullable: false),
                    Slika = table.Column<string>(type: "text", nullable: false),
                    Ime = table.Column<string>(type: "text", nullable: false),
                    Sifra = table.Column<byte[]>(type: "bytea", nullable: false),
                    Kljuc = table.Column<byte[]>(type: "bytea", nullable: false),
                    Uloga = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "RezultatiZahteva",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    podnosilacID = table.Column<int>(type: "integer", nullable: false),
                    zahtevID = table.Column<int>(type: "integer", nullable: false),
                    Tip = table.Column<int>(type: "integer", nullable: false),
                    Poruka = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RezultatiZahteva", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Aktivnosti",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: false),
                    NivoTezine = table.Column<double>(type: "double precision", nullable: false),
                    adminID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aktivnosti", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Aktivnosti_AdministratoriAktivnosti_adminID",
                        column: x => x.adminID,
                        principalTable: "AdministratoriAktivnosti",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Namirnice",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: false),
                    EnergetskaVrednost = table.Column<double>(type: "double precision", nullable: false),
                    Protein = table.Column<double>(type: "double precision", nullable: false),
                    UgljeniHidrati = table.Column<double>(type: "double precision", nullable: false),
                    Mast = table.Column<double>(type: "double precision", nullable: false),
                    Vrsta = table.Column<int>(type: "integer", nullable: false),
                    Tip = table.Column<int>(type: "integer", nullable: false),
                    DodataMast = table.Column<int>(type: "integer", nullable: false),
                    DodatoBrasno = table.Column<int>(type: "integer", nullable: false),
                    PromenaMase = table.Column<double>(type: "double precision", nullable: false),
                    Opis = table.Column<string>(type: "text", nullable: false),
                    adminID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Namirnice", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Namirnice_AdministratoriNamirnica_adminID",
                        column: x => x.adminID,
                        principalTable: "AdministratoriNamirnica",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Dani",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Datum = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Rezultat = table.Column<double>(type: "double precision", nullable: false),
                    Prijava = table.Column<bool>(type: "boolean", nullable: false),
                    korisnikID = table.Column<int>(type: "integer", nullable: false),
                    izvestajID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dani", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Dani_Korisnici_korisnikID",
                        column: x => x.korisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Jela",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: false),
                    Masa = table.Column<double>(type: "double precision", nullable: false),
                    EnergetskaVrednost = table.Column<double>(type: "double precision", nullable: false),
                    Recept = table.Column<string>(type: "text", nullable: false),
                    UgljeniHidrati = table.Column<double>(type: "double precision", nullable: false),
                    Mast = table.Column<double>(type: "double precision", nullable: false),
                    Protein = table.Column<double>(type: "double precision", nullable: false),
                    korisnikID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jela", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Jela_Korisnici_korisnikID",
                        column: x => x.korisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Objave",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Tekst = table.Column<string>(type: "text", nullable: false),
                    Slika = table.Column<string>(type: "text", nullable: false),
                    Vreme = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    autorID = table.Column<int>(type: "integer", nullable: false),
                    glavnaID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Objave", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Objave_Korisnici_autorID",
                        column: x => x.autorID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Objave_Objave_glavnaID",
                        column: x => x.glavnaID,
                        principalTable: "Objave",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Obroci",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: false),
                    EnergetskaVrednost = table.Column<double>(type: "double precision", nullable: false),
                    Masa = table.Column<double>(type: "double precision", nullable: false),
                    UgljeniHidrati = table.Column<double>(type: "double precision", nullable: false),
                    Mast = table.Column<double>(type: "double precision", nullable: false),
                    Protein = table.Column<double>(type: "double precision", nullable: false),
                    korisnikID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Obroci", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Obroci_Korisnici_korisnikID",
                        column: x => x.korisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ParoviKorisnika",
                columns: table => new
                {
                    pratilacID = table.Column<int>(type: "integer", nullable: false),
                    pracenID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParoviKorisnika", x => new { x.pracenID, x.pratilacID });
                    table.ForeignKey(
                        name: "FK_ParoviKorisnika_Korisnici_pracenID",
                        column: x => x.pracenID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParoviKorisnika_Korisnici_pratilacID",
                        column: x => x.pratilacID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Poruke",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Tekst = table.Column<string>(type: "text", nullable: false),
                    Vreme = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    autorID = table.Column<int>(type: "integer", nullable: false),
                    primalacID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Poruke", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Poruke_Korisnici_autorID",
                        column: x => x.autorID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Poruke_Korisnici_primalacID",
                        column: x => x.primalacID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Stanja",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Datum = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Visina = table.Column<double>(type: "double precision", nullable: false),
                    Bmi = table.Column<int>(type: "integer", nullable: false),
                    Tezina = table.Column<double>(type: "double precision", nullable: false),
                    BMR = table.Column<double>(type: "double precision", nullable: false),
                    EnergetskePotrebe = table.Column<double>(type: "double precision", nullable: false),
                    Protein = table.Column<double>(type: "double precision", nullable: false),
                    UgljeniHidrati = table.Column<double>(type: "double precision", nullable: false),
                    Mast = table.Column<double>(type: "double precision", nullable: false),
                    CiljnaKilaza = table.Column<double>(type: "double precision", nullable: false),
                    CiljniUnos = table.Column<double>(type: "double precision", nullable: false),
                    korisnikID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stanja", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Stanja_Korisnici_korisnikID",
                        column: x => x.korisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Treninzi",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: false),
                    Vreme = table.Column<int>(type: "integer", nullable: false),
                    NivoTezine = table.Column<double>(type: "double precision", nullable: false),
                    korisnikID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Treninzi", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Treninzi_Korisnici_korisnikID",
                        column: x => x.korisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ZahteviAktivnosti",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NazivAktivnosti = table.Column<string>(type: "text", nullable: false),
                    adminID = table.Column<int>(type: "integer", nullable: false),
                    Tip = table.Column<int>(type: "integer", nullable: false),
                    Stanje = table.Column<int>(type: "integer", nullable: false),
                    Podnet = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Prihvacen = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Zakljucen = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Poruka = table.Column<string>(type: "text", nullable: false),
                    Prijava = table.Column<bool>(type: "boolean", nullable: false),
                    podnosilacID = table.Column<int>(type: "integer", nullable: false),
                    rezultatID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahteviAktivnosti", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ZahteviAktivnosti_AdministratoriAktivnosti_adminID",
                        column: x => x.adminID,
                        principalTable: "AdministratoriAktivnosti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ZahteviAktivnosti_Korisnici_podnosilacID",
                        column: x => x.podnosilacID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ZahteviAktivnosti_RezultatiZahteva_rezultatID",
                        column: x => x.rezultatID,
                        principalTable: "RezultatiZahteva",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ZahteviNamirnica",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NazivNamirnice = table.Column<string>(type: "text", nullable: false),
                    adminID = table.Column<int>(type: "integer", nullable: false),
                    Tip = table.Column<int>(type: "integer", nullable: false),
                    Stanje = table.Column<int>(type: "integer", nullable: false),
                    Podnet = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Prihvacen = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Zakljucen = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Poruka = table.Column<string>(type: "text", nullable: false),
                    Prijava = table.Column<bool>(type: "boolean", nullable: false),
                    podnosilacID = table.Column<int>(type: "integer", nullable: false),
                    rezultatID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahteviNamirnica", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ZahteviNamirnica_AdministratoriNamirnica_adminID",
                        column: x => x.adminID,
                        principalTable: "AdministratoriNamirnica",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ZahteviNamirnica_Korisnici_podnosilacID",
                        column: x => x.podnosilacID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ZahteviNamirnica_RezultatiZahteva_rezultatID",
                        column: x => x.rezultatID,
                        principalTable: "RezultatiZahteva",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ZahteviZaPracenje",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    pracenID = table.Column<int>(type: "integer", nullable: false),
                    Tip = table.Column<int>(type: "integer", nullable: false),
                    Stanje = table.Column<int>(type: "integer", nullable: false),
                    Podnet = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Prihvacen = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Zakljucen = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Poruka = table.Column<string>(type: "text", nullable: false),
                    Prijava = table.Column<bool>(type: "boolean", nullable: false),
                    podnosilacID = table.Column<int>(type: "integer", nullable: false),
                    rezultatID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahteviZaPracenje", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ZahteviZaPracenje_Korisnici_podnosilacID",
                        column: x => x.podnosilacID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ZahteviZaPracenje_Korisnici_pracenID",
                        column: x => x.pracenID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ZahteviZaPracenje_RezultatiZahteva_rezultatID",
                        column: x => x.rezultatID,
                        principalTable: "RezultatiZahteva",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "KorisniciAktivnosti",
                columns: table => new
                {
                    korisnikID = table.Column<int>(type: "integer", nullable: false),
                    aktivnostID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KorisniciAktivnosti", x => new { x.korisnikID, x.aktivnostID });
                    table.ForeignKey(
                        name: "FK_KorisniciAktivnosti_Aktivnosti_aktivnostID",
                        column: x => x.aktivnostID,
                        principalTable: "Aktivnosti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KorisniciAktivnosti_Korisnici_korisnikID",
                        column: x => x.korisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "KorisniciNamirnice",
                columns: table => new
                {
                    korisnikID = table.Column<int>(type: "integer", nullable: false),
                    namirnicaID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KorisniciNamirnice", x => new { x.korisnikID, x.namirnicaID });
                    table.ForeignKey(
                        name: "FK_KorisniciNamirnice_Korisnici_korisnikID",
                        column: x => x.korisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KorisniciNamirnice_Namirnice_namirnicaID",
                        column: x => x.namirnicaID,
                        principalTable: "Namirnice",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Izvestaji",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    danID = table.Column<int>(type: "integer", nullable: false),
                    Tip = table.Column<int>(type: "integer", nullable: false),
                    Poruka = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Izvestaji", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Izvestaji_Dani_danID",
                        column: x => x.danID,
                        principalTable: "Dani",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "JelaNamirnice",
                columns: table => new
                {
                    jeloID = table.Column<int>(type: "integer", nullable: false),
                    namirnicaID = table.Column<int>(type: "integer", nullable: false),
                    masa = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JelaNamirnice", x => new { x.jeloID, x.namirnicaID });
                    table.ForeignKey(
                        name: "FK_JelaNamirnice_Jela_jeloID",
                        column: x => x.jeloID,
                        principalTable: "Jela",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JelaNamirnice_Namirnice_namirnicaID",
                        column: x => x.namirnicaID,
                        principalTable: "Namirnice",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Ocene",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Vrednost = table.Column<int>(type: "integer", nullable: false),
                    Vreme = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    objavaID = table.Column<int>(type: "integer", nullable: false),
                    korisnikID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ocene", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Ocene_Korisnici_korisnikID",
                        column: x => x.korisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Ocene_Objave_objavaID",
                        column: x => x.objavaID,
                        principalTable: "Objave",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DaniObroci",
                columns: table => new
                {
                    danID = table.Column<int>(type: "integer", nullable: false),
                    obrokID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaniObroci", x => new { x.danID, x.obrokID });
                    table.ForeignKey(
                        name: "FK_DaniObroci_Dani_danID",
                        column: x => x.danID,
                        principalTable: "Dani",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DaniObroci_Obroci_obrokID",
                        column: x => x.obrokID,
                        principalTable: "Obroci",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ObrociJela",
                columns: table => new
                {
                    obrokID = table.Column<int>(type: "integer", nullable: false),
                    jeloID = table.Column<int>(type: "integer", nullable: false),
                    masa = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ObrociJela", x => new { x.obrokID, x.jeloID });
                    table.ForeignKey(
                        name: "FK_ObrociJela_Jela_jeloID",
                        column: x => x.jeloID,
                        principalTable: "Jela",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ObrociJela_Obroci_obrokID",
                        column: x => x.obrokID,
                        principalTable: "Obroci",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DaniTreninzi",
                columns: table => new
                {
                    danID = table.Column<int>(type: "integer", nullable: false),
                    treningID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaniTreninzi", x => new { x.danID, x.treningID });
                    table.ForeignKey(
                        name: "FK_DaniTreninzi_Dani_danID",
                        column: x => x.danID,
                        principalTable: "Dani",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DaniTreninzi_Treninzi_treningID",
                        column: x => x.treningID,
                        principalTable: "Treninzi",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TreninziAktivnosti",
                columns: table => new
                {
                    treningID = table.Column<int>(type: "integer", nullable: false),
                    aktivnostID = table.Column<int>(type: "integer", nullable: false),
                    vreme = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TreninziAktivnosti", x => new { x.treningID, x.aktivnostID });
                    table.ForeignKey(
                        name: "FK_TreninziAktivnosti_Aktivnosti_aktivnostID",
                        column: x => x.aktivnostID,
                        principalTable: "Aktivnosti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TreninziAktivnosti_Treninzi_treningID",
                        column: x => x.treningID,
                        principalTable: "Treninzi",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ZahtevaneAktivnosti",
                columns: table => new
                {
                    zahtevID = table.Column<int>(type: "integer", nullable: false),
                    aktivnostID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahtevaneAktivnosti", x => new { x.zahtevID, x.aktivnostID });
                    table.ForeignKey(
                        name: "FK_ZahtevaneAktivnosti_Aktivnosti_zahtevID",
                        column: x => x.zahtevID,
                        principalTable: "Aktivnosti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ZahtevaneAktivnosti_ZahteviAktivnosti_aktivnostID",
                        column: x => x.aktivnostID,
                        principalTable: "ZahteviAktivnosti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ZahtevaneNamirnice",
                columns: table => new
                {
                    zahtevID = table.Column<int>(type: "integer", nullable: false),
                    namirnicaID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahtevaneNamirnice", x => new { x.zahtevID, x.namirnicaID });
                    table.ForeignKey(
                        name: "FK_ZahtevaneNamirnice_Namirnice_namirnicaID",
                        column: x => x.namirnicaID,
                        principalTable: "Namirnice",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ZahtevaneNamirnice_ZahteviNamirnica_zahtevID",
                        column: x => x.zahtevID,
                        principalTable: "ZahteviNamirnica",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Aktivnosti_adminID",
                table: "Aktivnosti",
                column: "adminID");

            migrationBuilder.CreateIndex(
                name: "IX_Aktivnosti_Naziv",
                table: "Aktivnosti",
                column: "Naziv",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Dani_korisnikID",
                table: "Dani",
                column: "korisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_DaniObroci_obrokID",
                table: "DaniObroci",
                column: "obrokID");

            migrationBuilder.CreateIndex(
                name: "IX_DaniTreninzi_treningID",
                table: "DaniTreninzi",
                column: "treningID");

            migrationBuilder.CreateIndex(
                name: "IX_Izvestaji_danID",
                table: "Izvestaji",
                column: "danID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Jela_korisnikID",
                table: "Jela",
                column: "korisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_JelaNamirnice_namirnicaID",
                table: "JelaNamirnice",
                column: "namirnicaID");

            migrationBuilder.CreateIndex(
                name: "IX_Korisnici_Ime",
                table: "Korisnici",
                column: "Ime",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KorisniciAktivnosti_aktivnostID",
                table: "KorisniciAktivnosti",
                column: "aktivnostID");

            migrationBuilder.CreateIndex(
                name: "IX_KorisniciNamirnice_namirnicaID",
                table: "KorisniciNamirnice",
                column: "namirnicaID");

            migrationBuilder.CreateIndex(
                name: "IX_Namirnice_adminID",
                table: "Namirnice",
                column: "adminID");

            migrationBuilder.CreateIndex(
                name: "IX_Namirnice_Naziv",
                table: "Namirnice",
                column: "Naziv",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Objave_autorID",
                table: "Objave",
                column: "autorID");

            migrationBuilder.CreateIndex(
                name: "IX_Objave_glavnaID",
                table: "Objave",
                column: "glavnaID");

            migrationBuilder.CreateIndex(
                name: "IX_Obroci_korisnikID",
                table: "Obroci",
                column: "korisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_ObrociJela_jeloID",
                table: "ObrociJela",
                column: "jeloID");

            migrationBuilder.CreateIndex(
                name: "IX_Ocene_korisnikID",
                table: "Ocene",
                column: "korisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Ocene_objavaID",
                table: "Ocene",
                column: "objavaID");

            migrationBuilder.CreateIndex(
                name: "IX_ParoviKorisnika_pratilacID",
                table: "ParoviKorisnika",
                column: "pratilacID");

            migrationBuilder.CreateIndex(
                name: "IX_Poruke_autorID",
                table: "Poruke",
                column: "autorID");

            migrationBuilder.CreateIndex(
                name: "IX_Poruke_primalacID",
                table: "Poruke",
                column: "primalacID");

            migrationBuilder.CreateIndex(
                name: "IX_Stanja_korisnikID",
                table: "Stanja",
                column: "korisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Treninzi_korisnikID",
                table: "Treninzi",
                column: "korisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_TreninziAktivnosti_aktivnostID",
                table: "TreninziAktivnosti",
                column: "aktivnostID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtevaneAktivnosti_aktivnostID",
                table: "ZahtevaneAktivnosti",
                column: "aktivnostID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtevaneNamirnice_namirnicaID",
                table: "ZahtevaneNamirnice",
                column: "namirnicaID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviAktivnosti_adminID",
                table: "ZahteviAktivnosti",
                column: "adminID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviAktivnosti_podnosilacID",
                table: "ZahteviAktivnosti",
                column: "podnosilacID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviAktivnosti_rezultatID",
                table: "ZahteviAktivnosti",
                column: "rezultatID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviNamirnica_adminID",
                table: "ZahteviNamirnica",
                column: "adminID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviNamirnica_podnosilacID",
                table: "ZahteviNamirnica",
                column: "podnosilacID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviNamirnica_rezultatID",
                table: "ZahteviNamirnica",
                column: "rezultatID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviZaPracenje_podnosilacID",
                table: "ZahteviZaPracenje",
                column: "podnosilacID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviZaPracenje_pracenID",
                table: "ZahteviZaPracenje",
                column: "pracenID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviZaPracenje_rezultatID",
                table: "ZahteviZaPracenje",
                column: "rezultatID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DaniObroci");

            migrationBuilder.DropTable(
                name: "DaniTreninzi");

            migrationBuilder.DropTable(
                name: "Izvestaji");

            migrationBuilder.DropTable(
                name: "JelaNamirnice");

            migrationBuilder.DropTable(
                name: "KorisniciAktivnosti");

            migrationBuilder.DropTable(
                name: "KorisniciNamirnice");

            migrationBuilder.DropTable(
                name: "ObrociJela");

            migrationBuilder.DropTable(
                name: "Ocene");

            migrationBuilder.DropTable(
                name: "ParoviKorisnika");

            migrationBuilder.DropTable(
                name: "Poruke");

            migrationBuilder.DropTable(
                name: "Stanja");

            migrationBuilder.DropTable(
                name: "TreninziAktivnosti");

            migrationBuilder.DropTable(
                name: "ZahtevaneAktivnosti");

            migrationBuilder.DropTable(
                name: "ZahtevaneNamirnice");

            migrationBuilder.DropTable(
                name: "ZahteviZaPracenje");

            migrationBuilder.DropTable(
                name: "Dani");

            migrationBuilder.DropTable(
                name: "Jela");

            migrationBuilder.DropTable(
                name: "Obroci");

            migrationBuilder.DropTable(
                name: "Objave");

            migrationBuilder.DropTable(
                name: "Treninzi");

            migrationBuilder.DropTable(
                name: "Aktivnosti");

            migrationBuilder.DropTable(
                name: "ZahteviAktivnosti");

            migrationBuilder.DropTable(
                name: "Namirnice");

            migrationBuilder.DropTable(
                name: "ZahteviNamirnica");

            migrationBuilder.DropTable(
                name: "AdministratoriAktivnosti");

            migrationBuilder.DropTable(
                name: "AdministratoriNamirnica");

            migrationBuilder.DropTable(
                name: "Korisnici");

            migrationBuilder.DropTable(
                name: "RezultatiZahteva");
        }
    }
}
