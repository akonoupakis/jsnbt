Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provision "ansible_local" do |ansible|
    ansible.playbook = "vagrant/ansible/pb.yaml"
    ansible.verbose = true
    ansible.install = true
  end

  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 3001, host: 3001
  config.vm.network "forwarded_port", guest: 27017, host: 27018
end
