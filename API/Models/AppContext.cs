using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using MoneyGrip.Models;

namespace MoneyGrip.Models
{
    public partial class AppContext : DbContext
    {
        public AppContext()
        {
        }

        public AppContext(DbContextOptions<AppContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Categorie> Categorie { get; set; }
        public virtual DbSet<Label> Label { get; set; }
        public virtual DbSet<Persoon> Persoon { get; set; }
        public virtual DbSet<Inkomst> Inkomst { get; set; }
        public virtual DbSet<Contract> Contract { get; set; }
        public virtual DbSet<Budget> Budget { get; set; }
        public virtual DbSet<Reservering> Reservering { get; set; }
        public virtual DbSet<Afschrijving> Afschrijving { get; set; }
        public virtual DbSet<Spaardoel> Spaardoel { get; set; }
        public virtual DbSet<BackupOverzicht> BackupOverzicht { get; set; }
      //  public virtual DbSet<InkomstLabel> InkomstLabel { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categorie>(entity =>
            {
                entity.Property(e => e.Kleur)
                    .IsRequired()
                    .HasMaxLength(7)
                    .IsUnicode(false);

                entity.Property(e => e.Naam)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Type)
                    .IsRequired();
            });

            modelBuilder.Entity<Label>(entity =>
            {
                entity.Property(e => e.Naam)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.CategorieNavigation)
                    .WithMany(p => p.Label)
                    .HasForeignKey(d => d.Categorie)
                    .HasConstraintName("FK_Label_Categorie");
            });

            modelBuilder.Entity<Persoon>(entity =>
            {
                entity.Property(e => e.Achternaam).HasMaxLength(30);

                entity.Property(e => e.Voornaam)
                    .IsRequired()
                    .HasMaxLength(20);
            });

            modelBuilder.Entity<BackupOverzicht>(entity =>
            {
                entity.Property(e => e.Bestandsnaam)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Inkomst>(entity =>
            {
                entity.Property(e => e.Interval)
                    .IsRequired();

                entity.Property(e => e.Begindatum)
                    .IsRequired();

                entity.Property(e => e.Bedrag)
                    .IsRequired();

                entity.HasOne(d => d.LabelNavigation)
                    .WithMany(p => p.Inkomst)
                    .HasForeignKey(d => d.Label)
                    .HasConstraintName("FK_Inkomst_Label");

                entity.HasOne(d => d.PersoonNavigation)
                    .WithMany(p => p.Inkomst)
                    .HasForeignKey(d => d.Persoon)
                    .HasConstraintName("FK_Inkomst_Persoon");
            });

            modelBuilder.Entity<Contract>(entity =>
            {
                entity.Property(e => e.Interval)
                    .IsRequired();

                entity.Property(e => e.Begindatum)
                    .IsRequired();

                entity.Property(e => e.Bedrag)
                    .IsRequired();

                entity.HasOne(d => d.LabelNavigation)
                    .WithMany(p => p.Contract)
                    .HasForeignKey(d => d.Label)
                    .HasConstraintName("FK_Contract_Label");
            });

            modelBuilder.Entity<Budget>(entity =>
            {
                entity.Property(e => e.Interval)
                    .IsRequired();

                entity.Property(e => e.Begindatum)
                    .IsRequired();

                entity.Property(e => e.Bedrag)
                    .IsRequired();

                entity.Property(e => e.Label)
                    .IsRequired();

                entity.HasOne(d => d.LabelNavigation)
                    .WithMany(p => p.Budget)
                    .HasForeignKey(d => d.Label)
                    .HasConstraintName("FK_Budget_Label");
            });

            modelBuilder.Entity<Reservering>(entity =>
            {
                entity.Property(e => e.Omschrijving)
                    .HasMaxLength(200);

                entity.Property(e => e.Maand)
                    .IsRequired();

                entity.Property(e => e.Bedrag)
                    .IsRequired();

                entity.HasOne(d => d.LabelNavigation)
                    .WithMany(p => p.Reservering)
                    .HasForeignKey(d => d.Label)
                    .HasConstraintName("FK_Reservering_Label");
            });

            modelBuilder.Entity<Afschrijving>(entity =>
            {

                entity.Property(e => e.VerwachteLevensduur)
                    .IsRequired();

                entity.Property(e => e.Aankoopdatum)
                    .IsRequired();

                entity.Property(e => e.Aankoopbedrag)
                    .IsRequired();

                entity.HasOne(d => d.LabelNavigation)
                    .WithMany(p => p.Afschrijving)
                    .HasForeignKey(d => d.Label)
                    .HasConstraintName("FK_Afschrijving_Label");
            });

            modelBuilder.Entity<Spaardoel>(entity =>
            {
                entity.Property(e => e.EersteMaand)
                    .IsRequired();

                entity.Property(e => e.LaatsteMaand)
                    .IsRequired();

                entity.HasOne(d => d.LabelNavigation)
                    .WithMany(p => p.Spaardoel)
                    .HasForeignKey(d => d.Label)
                    .HasConstraintName("FK_Spaardoel_Label");
            });

        /*    modelBuilder.Entity<InkomstLabel>()
                .HasKey(il => new { il.InkomstId, il.LabelId });

            modelBuilder.Entity<InkomstLabel>()
                .HasOne(il => il.Inkomst)
                .WithMany(i => i.InkomstLabels)
                .HasForeignKey(il => il.InkomstId)
                .HasConstraintName("FK_Koppeling_Inkomst");

            modelBuilder.Entity<InkomstLabel>()
                .HasOne(il => il.Label)
                .WithMany(i => i.InkomstLabels)
                .HasForeignKey(il => il.LabelId)
                .HasConstraintName("FK_Koppeling_Label");*/
        }
    }
}
