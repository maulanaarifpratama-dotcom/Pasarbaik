import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold mb-3">PasarBaik</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Impact Supply Aggregator Platform — menghubungkan produk UMKM berdampak dari program pembinaan ke pasar korporat.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-foreground/50">Platform</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/products" className="hover:text-accent transition-colors">Product Catalog</Link></li>
              <li><Link to="/suppliers" className="hover:text-accent transition-colors">Suppliers</Link></li>
              <li><Link to="/programs" className="hover:text-accent transition-colors">Programs</Link></li>
              <li><Link to="/rfq" className="hover:text-accent transition-colors">Request Quote</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-foreground/50">Impact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/impact" className="hover:text-accent transition-colors">Impact Dashboard</Link></li>
              <li><Link to="/csr" className="hover:text-accent transition-colors">Partner With Us</Link></li>
              <li><Link to="/admin" className="hover:text-accent transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-foreground/50">Contact</h4>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              info@pasarbaik.com<br />
              Jakarta, Indonesia
            </p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-xs text-primary-foreground/50">
          © 2026 PasarBaik. All rights reserved. Impact Supply Aggregator Platform.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
