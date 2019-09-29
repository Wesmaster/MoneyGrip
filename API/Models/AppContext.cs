using Microsoft.EntityFrameworkCore;

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

        public virtual DbSet<Label> Label { get; set; }
        public virtual DbSet<Persoon> Persoon { get; set; }
        public virtual DbSet<Inkomst> Inkomst { get; set; }
        public virtual DbSet<Contract> Contract { get; set; }
        public virtual DbSet<Budget> Budget { get; set; }
        public virtual DbSet<Reservering> Reservering { get; set; }
        public virtual DbSet<Afschrijving> Afschrijving { get; set; }
        public virtual DbSet<Spaardoel> Spaardoel { get; set; }
        public virtual DbSet<BackupOverzicht> BackupOverzicht { get; set; }
        public virtual DbSet<InkomstLabel> InkomstLabel { get; set; }
        public virtual DbSet<BudgetLabel> BudgetLabel { get; set; }
        public virtual DbSet<AfschrijvingLabel> AfschrijvingLabel { get; set; }
        public virtual DbSet<ContractLabel> ContractLabel { get; set; }
        public virtual DbSet<ReserveringLabel> ReserveringLabel { get; set; }
        public virtual DbSet<SpaardoelLabel> SpaardoelLabel { get; set; }
        public virtual DbSet<Lening> Lening { get; set; }
        public virtual DbSet<LeningLabel> LeningLabel { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Label>(entity =>
            {
                entity.Property(e => e.Naam)
                    .IsRequired()
                    .HasMaxLength(50);
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
            });

            modelBuilder.Entity<Budget>(entity =>
            {
                entity.Property(e => e.Interval)
                    .IsRequired();

                entity.Property(e => e.Begindatum)
                    .IsRequired();

                entity.Property(e => e.Bedrag)
                    .IsRequired();
            });

            modelBuilder.Entity<Reservering>(entity =>
            {
                entity.Property(e => e.Omschrijving)
                    .HasMaxLength(200);

                entity.Property(e => e.Maand)
                    .IsRequired();

                entity.Property(e => e.Bedrag)
                    .IsRequired();
            });

            modelBuilder.Entity<Afschrijving>(entity =>
            {
                entity.Property(e => e.VerwachteLevensduur)
                    .IsRequired();

                entity.Property(e => e.Aankoopdatum)
                    .IsRequired();

                entity.Property(e => e.Aankoopbedrag)
                    .IsRequired();
            });

            modelBuilder.Entity<Spaardoel>(entity =>
            {
                entity.Property(e => e.EersteMaand)
                    .IsRequired();

                entity.Property(e => e.LaatsteMaand)
                    .IsRequired();
            });

            modelBuilder.Entity<Lening>(entity =>
            {
                entity.Property(e => e.Looptijd)
                    .IsRequired();

                entity.Property(e => e.Begindatum)
                    .IsRequired();

                entity.Property(e => e.Bedrag)
                    .IsRequired();

                entity.Property(e => e.Rente)
                    .IsRequired();

                entity.Property(e => e.Type)
                    .IsRequired();
            });

            modelBuilder.Entity<InkomstLabel>()
                .HasKey(il => new { il.InkomstId, il.LabelId });

            modelBuilder.Entity<InkomstLabel>()
                .HasOne(il => il.Inkomst)
                .WithMany(i => i.InkomstLabels)
                .HasForeignKey(il => il.InkomstId)
                .HasConstraintName("FK_InkomstLabel_Koppeling_Inkomst");

            modelBuilder.Entity<InkomstLabel>()
                .HasOne(il => il.Label)
                .WithMany(i => i.InkomstLabels)
                .HasForeignKey(il => il.LabelId)
                .HasConstraintName("FK_InkomstLabel_Koppeling_Label");

            modelBuilder.Entity<BudgetLabel>()
                .HasKey(bl => new { bl.BudgetId, bl.LabelId });

            modelBuilder.Entity<BudgetLabel>()
                .HasOne(bl => bl.Budget)
                .WithMany(b => b.BudgetLabels)
                .HasForeignKey(bl => bl.BudgetId)
                .HasConstraintName("FK_BudgetLabel_Koppeling_Budget");

            modelBuilder.Entity<BudgetLabel>()
                .HasOne(bl => bl.Label)
                .WithMany(b => b.BudgetLabels)
                .HasForeignKey(bl => bl.LabelId)
                .HasConstraintName("FK_BudgetLabel_Koppeling_Label");

            modelBuilder.Entity<AfschrijvingLabel>()
                .HasKey(al => new { al.AfschrijvingId, al.LabelId });

            modelBuilder.Entity<AfschrijvingLabel>()
                .HasOne(al => al.Afschrijving)
                .WithMany(a => a.AfschrijvingLabels)
                .HasForeignKey(al => al.AfschrijvingId)
                .HasConstraintName("FK_AfschrijvingLabel_Koppeling_Afschrijving");

            modelBuilder.Entity<AfschrijvingLabel>()
                .HasOne(al => al.Label)
                .WithMany(a => a.AfschrijvingLabels)
                .HasForeignKey(al => al.LabelId)
                .HasConstraintName("FK_AfschrijvingLabel_Koppeling_Label");

            modelBuilder.Entity<ContractLabel>()
                .HasKey(cl => new { cl.ContractId, cl.LabelId });

            modelBuilder.Entity<ContractLabel>()
                .HasOne(cl => cl.Contract)
                .WithMany(c => c.ContractLabels)
                .HasForeignKey(cl => cl.ContractId)
                .HasConstraintName("FK_ContractLabel_Koppeling_Contract");

            modelBuilder.Entity<ContractLabel>()
                .HasOne(cl => cl.Label)
                .WithMany(c => c.ContractLabels)
                .HasForeignKey(cl => cl.LabelId)
                .HasConstraintName("FK_ContractLabel_Koppeling_Label");

            modelBuilder.Entity<ReserveringLabel>()
                .HasKey(cl => new { cl.ReserveringId, cl.LabelId });

            modelBuilder.Entity<ReserveringLabel>()
                .HasOne(cl => cl.Reservering)
                .WithMany(c => c.ReserveringLabels)
                .HasForeignKey(cl => cl.ReserveringId)
                .HasConstraintName("FK_ReserveringLabel_Koppeling_Reservering");

            modelBuilder.Entity<ReserveringLabel>()
                .HasOne(cl => cl.Label)
                .WithMany(c => c.ReserveringLabels)
                .HasForeignKey(cl => cl.LabelId)
                .HasConstraintName("FK_ReserveringLabel_Koppeling_Label");

            modelBuilder.Entity<SpaardoelLabel>()
            .HasKey(cl => new { cl.SpaardoelId, cl.LabelId });

            modelBuilder.Entity<SpaardoelLabel>()
                .HasOne(cl => cl.Spaardoel)
                .WithMany(c => c.SpaardoelLabels)
                .HasForeignKey(cl => cl.SpaardoelId)
                .HasConstraintName("FK_SpaardoelLabel_Koppeling_Spaardoel");

            modelBuilder.Entity<SpaardoelLabel>()
                .HasOne(cl => cl.Label)
                .WithMany(c => c.SpaardoelLabels)
                .HasForeignKey(cl => cl.LabelId)
                .HasConstraintName("FK_SpaardoelLabel_Koppeling_Label");

            modelBuilder.Entity<LeningLabel>()
                .HasOne(ll => ll.Label)
                .WithMany(l => l.LeningLabels)
                .HasForeignKey(ll => ll.LabelId)
                .HasConstraintName("FK_LeningLabel_Koppeling_Label");
        }
    }
}
